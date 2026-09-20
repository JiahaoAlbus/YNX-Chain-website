export function findRetiredNetworkIdentity(source) {
  const identitySource = source.replace(/(["'](?:sha256|htmlSha256|sourceSha256)["']\s*:\s*["'])[a-f0-9]{64}(["'])/gi, '$1[digest]$2');
  return ['9102', '0x238e', 'ynx_9102-1'].find(identity => identitySource.includes(identity)) || null;
}
