# Production observation — 2026-07-29

Local evidence commit: `eaf279c9aad22059d5a832bc6455b926509d4b22`

This bounded, unauthenticated observation checked `https://www.ynxweb4.com` without deployment or search-provider credentials. It proves endpoint reachability and a source mismatch; it does not prove the current Website branch is deployed.

| Route | HTTP | Response SHA-256 | Observation |
| --- | ---: | --- | --- |
| `/` | 200 | `45fcfd1ac9aa6ddda9e7c44c559f5ca4f01c92374dc5bf800fe0d1de2dc26a0a` | Public HTML is reachable. |
| `/status` | 200 | `45fcfd1ac9aa6ddda9e7c44c559f5ca4f01c92374dc5bf800fe0d1de2dc26a0a` | SPA fallback returned the same document as `/`; this is not an independent status receipt. |
| `/product-release.json` | 200 | `670c4fe332a35bdebb271e2323665d3d471c87934d49076b5dff50185612421c` | Remote record identifies documentation source `c8c4ff7263e50afc4c731dac8157aa85e02232dc`, not the Website source. |
| `/public-product-metadata.json` | 200 | `09fe69c6ecd7540f53b8e4e8171798e56774ddf0159fa842e765d5133ee3bf0e` | Remote record identifies source `2e3c893c7c97e7bc713af4e9a74438ffd125289f`, not the Website source. |
| `/releases/ecosystem-release-registry.json` | 200 | `c76646686f09c7f886e6c2c37d2a12ca6438852cb9b7f15cbd9491d494bf7f18` | Response differs from the current local registry SHA-256 `49ce46ee77b0027e106aea32d4c6532eb583ac2d4e3b775a6142310a9a5ffa92`. |
| `/sitemap.xml` | 200 | `c7055874229d3fc6fec761ede0331e7d069db75ce200ac608e6b702c646e2e69` | Sitemap is reachable but belongs to the observed deployment, not the current source. |
| `/robots.txt` | 200 | `42738467b51dd0746ce264adccdca8ff82a7edab22ebab189480ec62a6667016` | Robots policy is reachable. |
| `/da45868fe3e0818f27f187b21a56ccb5.txt` | 200 | `702f97059a20d50c507de8ae94e6df2348411453091e9271a644da32bfa8b16b` | IndexNow key file matches its public filename. |

Conclusion: the origin is publicly reachable, but exact-current-source verification is false. Current-source deployment, Search Console/Bing ownership, IndexNow submission receipt, index coverage, production monitoring, incident/rollback drills, and production accessibility regression evidence require external authority or credentials.
