import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch


MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "public-readback.py"
spec = importlib.util.spec_from_file_location("public_readback", MODULE_PATH)
readback = importlib.util.module_from_spec(spec)
spec.loader.exec_module(readback)


class PublicReadbackTests(unittest.TestCase):
    def setUp(self):
        self.source = "a" * 40
        self.tree = "b" * 40
        readback.SOURCE_COMMIT = self.source
        readback.SOURCE_TREE = self.tree
        readback.ENTRY = "index-AbCdEf12.js"
        readback.COPY_SHA256 = "c" * 64
        readback.WORKFLOW_SHA = self.source
        readback.result["checks"] = []

    def response(self, body, content_type):
        return body, {
            "status": 200,
            "finalUrl": "https://www.ynxweb4.com/test",
            "contentType": content_type,
            "bytes": len(body),
            "sha256": hashlib.sha256(body).hexdigest(),
        }

    def test_valid_identity_preserves_observed_values(self):
        body = json.dumps({"schemaVersion": "ynx.website.build-identity.v1", "sourceCommit": self.source, "sourceTree": self.tree, "chainId": 6423}).encode()
        with patch.object(readback, "get", return_value=self.response(body, "application/json")):
            readback.run("identity", "https://www.ynxweb4.com/api/build-identity", readback.identity)
        check = readback.result["checks"][0]
        self.assertTrue(check["passed"])
        self.assertEqual(check["observedSourceCommit"], self.source)
        self.assertEqual(check["observedSourceTree"], self.tree)

    def test_stale_identity_fails_but_preserves_safe_observed_values_and_http_evidence(self):
        stale = "d" * 40
        body = json.dumps({"schemaVersion": "ynx.website.build-identity.v1", "sourceCommit": stale, "sourceTree": self.tree, "chainId": 6423}).encode()
        with patch.object(readback, "get", return_value=self.response(body, "application/json")):
            readback.run("identity", "https://www.ynxweb4.com/api/build-identity", readback.identity)
        check = readback.result["checks"][0]
        self.assertFalse(check["passed"])
        self.assertEqual(check["error"]["kind"], "IDENTITY_MISMATCH")
        self.assertEqual(check["observedSourceCommit"], stale)
        self.assertEqual(check["observedSourceTree"], self.tree)
        self.assertEqual(check["status"], 200)
        self.assertEqual(check["bytes"], len(body))
        self.assertEqual(check["sha256"], hashlib.sha256(body).hexdigest())
        self.assertNotIn("response", check)

    def test_wrong_html_and_zip_digest_fail_closed(self):
        html = b"<html><head></head><body>old asset</body></html>"
        with patch.object(readback, "get", return_value=self.response(html, "text/html")):
            readback.run("html", "https://www.ynxweb4.com/dapp/download", readback.html)
        self.assertEqual(readback.result["checks"][0]["error"]["kind"], "HTML_NEW_ASSET_MISMATCH")
        zip_body = b"PK\x03\x04wrong"
        with patch.object(readback, "get", return_value=self.response(zip_body, "application/zip")):
            readback.run("zip", "https://www.ynxweb4.com/downloads/wallet-web/test.zip", readback.zipfile)
        self.assertEqual(readback.result["checks"][1]["error"]["kind"], "CHROME_ZIP_MISMATCH")
        self.assertEqual(readback.result["checks"][1]["sha256"], hashlib.sha256(zip_body).hexdigest())

    def test_invalid_inputs_never_start_a_network_check_and_write_json(self):
        readback.SOURCE_COMMIT = "not-a-commit"
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(readback, "RESULT_PATH", Path(directory) / "result.json"), patch.object(readback, "run", side_effect=AssertionError("network attempted")):
                self.assertEqual(readback.main(), 1)
                saved = json.loads((Path(directory) / "result.json").read_text())
        self.assertEqual(saved["checks"][0]["error"]["kind"], "INVALID_SOURCE_IDENTITY")


if __name__ == "__main__":
    unittest.main()
