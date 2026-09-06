# 开始使用

运行 `make devnet`，然后使用 `http://127.0.0.1:6420` 访问 REST，使用 `/evm` 访问 JSON-RPC。

审阅者快速检查：

```bash
make developer-quickstart-check
```

此检查会启动或复用一个本地 YNX Testnet 端点，申请 Faucet YNXT，通过 IDE API 编译 Solidity 示例，部署并验证合约，调用 Trust、Resource Market 的报价、委托、租赁、收入和分析接口，以及 Pay 示例 API，并检查 JavaScript 和 Python SDK 入口。
