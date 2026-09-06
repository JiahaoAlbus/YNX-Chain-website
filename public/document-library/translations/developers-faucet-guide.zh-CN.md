# Faucet 指南

本地链 RPC 仍支持 `POST /faucet`，用于开发者冒烟测试。公开 Faucet 流量应经过 `ynx-faucetd`；它会验证地址，按 IP 和地址限流，并写入权限为 `0600` 的 JSONL 请求日志。

`YNX_FAUCET_UPSTREAM_MODE=authoritative` 保留当前与回滚兼容的特权 RPC 路径。`YNX_FAUCET_UPSTREAM_MODE=bft` 只接受规范的小写 EVM 兼容接收地址，要求链 ID 为 `6423`，派生并验证 `YNX_FAUCET_ADDRESS`，查询账户精确的下一个 nonce，在本地签名，并且只向回环地址上的 BFT Gateway 提交规范的已签名交易信封。必须且只能提供一种密钥来源：规范十六进制格式的 `FAUCET_PRIVATE_KEY`，或位于 `YNX_FAUCET_PRIVATE_KEY_FILE`、权限受限且为普通文件的原始 32 字节密钥文件。密钥必须留在进程本地，绝不能记录到日志或发送到上游。

本地验证：

```bash
make faucet-check
```

请求：

```bash
curl -fsS -X POST http://127.0.0.1:6428/request \
  -H 'content-type: application/json' \
  -d '{"address":"ynx_developer"}'
```
