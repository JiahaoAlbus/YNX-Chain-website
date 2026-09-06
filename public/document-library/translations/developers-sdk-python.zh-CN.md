# Python SDK

`sdk/python` 中仅使用标准库的客户端，可读取 YNX REST 状态和 EVM JSON-RPC，不会修改链状态。其 `pyproject.toml` 支持本地打包，但本文不声称该包已发布到 PyPI。

```python
from ynx_client import YNXClient, assert_ynx_testnet_snapshot

client = YNXClient(
    rest_url="https://rpc.ynxweb4.com",
    evm_url="https://evm.ynxweb4.com",
)
snapshot = assert_ynx_testnet_snapshot(client.get_chain_snapshot())
print(snapshot["status"]["height"], snapshot["evmChainId"])
```

运行 `make sdk-check`，可执行基于测试夹具的单元和打包检查、可离线安装的确定性 wheel 验证，以及仅使用构建产物的隔离消费者测试。`make sdk-remote-check` 提供对公开测试网的只读兼容性证明。规范清单及可选的所有者提供分离签名的边界，见 `docs/developers/SDK_RELEASE_INTEGRITY.md`。
