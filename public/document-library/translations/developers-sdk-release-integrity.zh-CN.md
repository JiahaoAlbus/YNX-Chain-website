# SDK 发布完整性

YNX Chain 使用规范清单构建本地 JavaScript 和 Python SDK 产物。这界定的是可复现打包与验证，不代表已经发布到 npm 或 PyPI。

生成未签名的本地包集合：

```bash
make sdk-release-package
```

`tmp/packages/sdk-release` 下的输出包含：

- 与 npm 兼容、可确定性构建的 JavaScript `.tgz`；
- 可确定性构建、可离线安装的纯 Python `.whl`；
- `sdk-release-manifest.json`，绑定两个包的名称和版本、链 ID、`YNXT`、源码提交、地址测试向量摘要、限定范围的源码与归档文件、构建产物大小及 SHA-256 值；
- 每个包明确的 `registryPublished: false` 状态。

验证清单、源码检出、归档、路径、权限、摘要、包元数据和未发布状态：

```bash
node scripts/verify/sdk-release-verify.mjs \
  --manifest tmp/packages/sdk-release/sdk-release-manifest.json \
  --artifacts tmp/packages/sdk-release \
  --source-root .
```

所有者可使用已有的 Ed25519 密钥独立签署清单的精确字节。仓库工具不会生成或读取所有者私钥。验证在外部生成的分离签名：

```bash
node scripts/verify/sdk-release-verify.mjs \
  --manifest tmp/packages/sdk-release/sdk-release-manifest.json \
  --artifacts tmp/packages/sdk-release \
  --source-root . \
  --public-key owner-sdk-release-public.pem \
  --signature sdk-release-manifest.sig
```

`make sdk-release-integrity-check` 执行两次干净构建，比较每个输出摘要，验证仅用于测试的临时 Ed25519 签名，拒绝被修改的产物、元数据、向量和签名，拒绝归档中额外的条目、路径穿越条目和符号链接，并将两个产物安装到隔离消费者中。此检查不会登录包注册中心，也不会发布。

只有当所有者批准精确清单，通过外部受保护流程提供注册中心凭据，发布同一组已验证产物字节，并由独立消费者验证从注册中心下载的内容后，发布才算完成。本地产物、分离测试签名或就绪包，不得被描述为已发布到 npm 或 PyPI。
