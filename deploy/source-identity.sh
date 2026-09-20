#!/usr/bin/env bash

# Source this file from production build/deploy entrypoints so the validated
# identity remains in their environment and can be passed to Vercel.
website_identity_verifier="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/verify-source-identity.mjs"
website_vercel_config_verifier="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/verify-vercel-config-equivalence.mjs"
if ! website_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  # Vercel remote builders receive an archive without .git. They may only use
  # the complete identity injected by the clean local deployment gate.
  node "$website_identity_verifier" || {
    return 1 2>/dev/null || exit 1
  }
  unset website_identity_verifier website_root website_vercel_config_verifier
  return 0 2>/dev/null || exit 0
fi

website_commit="$(git -C "$website_root" rev-parse --verify HEAD)"
website_dirty_paths="$(git -C "$website_root" status --porcelain=v1 --untracked-files=normal)"
if [[ -n "$website_dirty_paths" ]]; then
  if [[ "${VERCEL:-}" == "1" && "${VERCEL_GIT_COMMIT_SHA:-}" == "$website_commit" && "$website_dirty_paths" == " M vercel.json" ]]; then
    (cd "$website_root" && node "$website_vercel_config_verifier") || {
      return 1 2>/dev/null || exit 1
    }
  else
    echo "Website production build requires a clean Git worktree" >&2
    echo "Dirty paths (status and repository-relative path only):" >&2
    while IFS= read -r website_dirty_path; do
      printf '  %s\n' "$website_dirty_path" >&2
    done <<< "$website_dirty_paths"
    return 1 2>/dev/null || exit 1
  fi
fi

website_tree="$(git -C "$website_root" rev-parse --verify 'HEAD^{tree}')"
website_identity_count=0
for website_key in YNX_WEBSITE_SOURCE_COMMIT YNX_WEBSITE_SOURCE_TREE YNX_WEBSITE_RELEASE; do
  [[ -n "${!website_key:-}" ]] && website_identity_count=$((website_identity_count + 1))
done

if [[ "$website_identity_count" -ne 0 && "$website_identity_count" -ne 3 ]]; then
  echo "Website source identity must provide commit, tree and release together" >&2
  return 1 2>/dev/null || exit 1
fi

if [[ "$website_identity_count" -eq 0 ]]; then
  export YNX_WEBSITE_SOURCE_COMMIT="$website_commit"
  export YNX_WEBSITE_SOURCE_TREE="$website_tree"
  export YNX_WEBSITE_RELEASE="website-${website_commit:0:12}"
else
  if [[ "$YNX_WEBSITE_SOURCE_COMMIT" != "$website_commit" ]]; then
    echo "YNX_WEBSITE_SOURCE_COMMIT does not match exact HEAD" >&2
    return 1 2>/dev/null || exit 1
  fi
  if [[ "$YNX_WEBSITE_SOURCE_TREE" != "$website_tree" ]]; then
    echo "YNX_WEBSITE_SOURCE_TREE does not match the exact HEAD tree" >&2
    return 1 2>/dev/null || exit 1
  fi
  if [[ ! "$YNX_WEBSITE_RELEASE" =~ ^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$ ]]; then
    echo "YNX_WEBSITE_RELEASE is invalid" >&2
    return 1 2>/dev/null || exit 1
  fi
fi

node "$website_identity_verifier" || {
  return 1 2>/dev/null || exit 1
}

unset website_commit website_tree website_dirty_path website_dirty_paths website_identity_count website_identity_verifier website_key website_root website_vercel_config_verifier
