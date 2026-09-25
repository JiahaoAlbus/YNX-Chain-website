#!/usr/bin/env python3
"""One-shot, credential-free public readback from a GitHub-hosted runner."""

import hashlib
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

SOURCE_COMMIT = os.environ.get("EXPECTED_SOURCE_COMMIT", "")
SOURCE_TREE = os.environ.get("EXPECTED_SOURCE_TREE", "")
ENTRY = os.environ.get("EXPECTED_ENTRY", "")
COPY_SHA256 = os.environ.get("EXPECTED_COPY_SHA256", "")
WORKFLOW_SHA = os.environ.get("WORKFLOW_SHA", "")
CHROME_SHA256 = "51a6940a0dedc84b2012e24494588b8a45205cb33da61e7e108f591fa803b089"
CHROME_BYTES = 585033
COPY_CHUNK = "/assets/wallet-download-copy-Bjo3r5AS.js"
BASE = "https://www.ynxweb4.com"
ZIP_PATH = f"/downloads/wallet-web/sha256-{CHROME_SHA256}/ynx-wallet-chrome-edge-0.1.4.zip"
RESULT_PATH = Path("public-readback-result.json")


class StrictRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        parsed = urllib.parse.urlparse(newurl)
        allowed = parsed.hostname in {
            "www.ynxweb4.com", "ynxweb4.com", "github.com",
            "release-assets.githubusercontent.com", "objects.githubusercontent.com",
        }
        if parsed.scheme != "https" or not allowed:
            raise ValueError("UNAPPROVED_REDIRECT")
        return super().redirect_request(request, fp, code, msg, headers, newurl)


opener = urllib.request.build_opener(StrictRedirect(), urllib.request.HTTPSHandler(context=ssl.create_default_context()))
result = {
    "schemaVersion": "ynx.website.public-readback.v1",
    "observedAt": datetime.now(timezone.utc).isoformat(),
    "expectedSourceCommit": SOURCE_COMMIT,
    "expectedSourceTree": SOURCE_TREE,
    "expectedEntry": ENTRY,
    "expectedCopySha256": COPY_SHA256,
    "expectedChromeSha256": CHROME_SHA256,
    "checks": [],
}


class CheckFailure(Exception):
    def __init__(self, code, evidence=None):
        super().__init__(code)
        self.code = code
        self.evidence = evidence or {}


def get(url, max_bytes):
    request = urllib.request.Request(url, headers={"User-Agent": "YNX-Website-Readback/1", "Cache-Control": "no-cache"})
    with opener.open(request, timeout=12) as response:
        body = response.read(max_bytes + 1)
        if len(body) > max_bytes:
            raise ValueError("BODY_TOO_LARGE")
        final = urllib.parse.urlparse(response.geturl())
        return body, {
            "status": response.status,
            "finalUrl": urllib.parse.urlunparse((final.scheme, final.netloc, final.path, "", "", "")),
            "contentType": response.headers.get("Content-Type", ""),
            "bytes": len(body),
            "sha256": hashlib.sha256(body).hexdigest(),
        }


def run(name, url, checker):
    entry = {"name": name, "url": url, "passed": False}
    try:
        entry.update(checker(url))
        entry["passed"] = True
    except CheckFailure as error:
        entry.update(error.evidence)
        entry["error"] = {"kind": error.code}
    except urllib.error.HTTPError as error:
        entry["error"] = {"kind": "HTTP_ERROR", "status": error.code}
    except urllib.error.URLError as error:
        entry["error"] = {"kind": "NETWORK_OR_TLS_ERROR", "detail": str(error.reason)[:160]}
    except Exception as error:
        entry["error"] = {"kind": type(error).__name__, "detail": str(error)[:160]}
    result["checks"].append(entry)


def identity(url):
    body, metadata = get(url, 16384)
    if not metadata["contentType"].lower().startswith("application/json"):
        raise CheckFailure("IDENTITY_CONTENT_TYPE", metadata)
    parsed = json.loads(body)
    observed = {
        "observedSourceCommit": parsed.get("sourceCommit") if isinstance(parsed.get("sourceCommit"), str) and re.fullmatch(r"[0-9a-f]{40}", parsed["sourceCommit"]) else None,
        "observedSourceTree": parsed.get("sourceTree") if isinstance(parsed.get("sourceTree"), str) and re.fullmatch(r"[0-9a-f]{40}", parsed["sourceTree"]) else None,
    }
    if parsed.get("sourceCommit") != SOURCE_COMMIT or parsed.get("sourceTree") != SOURCE_TREE:
        raise CheckFailure("IDENTITY_MISMATCH", {**metadata, **observed})
    if parsed.get("chainId") != 6423 or parsed.get("schemaVersion") != "ynx.website.build-identity.v1":
        raise CheckFailure("IDENTITY_SCHEMA_MISMATCH", {**metadata, **observed})
    return {**metadata, **observed, "release": parsed.get("release")}


def html(url):
    body, metadata = get(url, 2_000_000)
    if not metadata["contentType"].lower().startswith("text/html"):
        raise CheckFailure("HTML_CONTENT_TYPE", metadata)
    text = body.decode("utf-8")
    if COPY_CHUNK not in text or f"/assets/{ENTRY}" not in text:
        raise CheckFailure("HTML_NEW_ASSET_MISMATCH", metadata)
    if not re.search(r'<script[^>]+src="/assets/' + re.escape(ENTRY) + r'"', text):
        raise CheckFailure("HTML_ENTRY_SCRIPT_MISSING", metadata)
    return metadata


def javascript(url):
    body, metadata = get(url, 2_000_000)
    if "javascript" not in metadata["contentType"].lower():
        raise CheckFailure("SCRIPT_CONTENT_TYPE", metadata)
    if b"0.1.4" not in body:
        raise CheckFailure("SCRIPT_CHROME_014_MISMATCH", metadata)
    if metadata["sha256"] != COPY_SHA256:
        raise CheckFailure("SCRIPT_DIGEST_MISMATCH", metadata)
    return metadata


def zipfile(url):
    body, metadata = get(url, 1_000_000)
    if metadata["bytes"] != CHROME_BYTES or metadata["sha256"] != CHROME_SHA256:
        raise CheckFailure("CHROME_ZIP_MISMATCH", metadata)
    if not body.startswith(b"PK\x03\x04"):
        raise CheckFailure("CHROME_ZIP_FORMAT", metadata)
    return metadata


def main():
    if not re.fullmatch(r"[0-9a-f]{40}", SOURCE_COMMIT) or not re.fullmatch(r"[0-9a-f]{40}", SOURCE_TREE):
        result["checks"].append({"name": "input-validation", "passed": False, "error": {"kind": "INVALID_SOURCE_IDENTITY"}})
    elif WORKFLOW_SHA and SOURCE_COMMIT != WORKFLOW_SHA:
        result["checks"].append({"name": "input-validation", "passed": False, "error": {"kind": "WORKFLOW_COMMIT_MISMATCH"}})
    elif not re.fullmatch(r"index-[A-Za-z0-9_-]{8}\.js", ENTRY) or not re.fullmatch(r"[0-9a-f]{64}", COPY_SHA256):
        result["checks"].append({"name": "input-validation", "passed": False, "error": {"kind": "INVALID_ASSET_IDENTITY"}})
    else:
        run("www-build-identity", f"{BASE}/api/build-identity", identity)
        run("root-build-identity", "https://ynxweb4.com/api/build-identity", identity)
        run("www-download-html", f"{BASE}/dapp/download", html)
        run("www-chrome-014-copy-chunk", f"{BASE}{COPY_CHUNK}", javascript)
        run("www-chrome-014-zip", f"{BASE}{ZIP_PATH}", zipfile)
    result["passed"] = all(check["passed"] for check in result["checks"])
    RESULT_PATH.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("PUBLIC_READBACK_JSON:" + json.dumps(result, ensure_ascii=False, separators=(",", ":")))
    return 0 if result["passed"] else 1


if __name__ == "__main__":
    sys.exit(main())
