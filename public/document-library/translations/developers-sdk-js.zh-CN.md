# JavaScript SDK

`sdk/js` 中不依赖第三方包的 ESM 客户端，可读取 YNX REST 状态和 EVM JSON-RPC，不会修改链状态。它已具备打包条件，但本文不声称它已发布到 npm。

```js
import {YNXClient, assertYNXTestnetSnapshot} from "@ynx-chain/sdk";

const client = new YNXClient({
  restUrl: "https://rpc.ynxweb4.com",
  evmUrl: "https://evm.ynxweb4.com",
});
const snapshot = assertYNXTestnetSnapshot(await client.getChainSnapshot());
console.log(snapshot.status.height, snapshot.evmChainId);
```

SDK 还导出 `ensureYNXTestnet(provider)` 和 `ynxTestnetAddEthereumChainParameter()`，用于绑定网络元数据的 EIP-1193 自定义网络集成。辅助函数不会请求账户或交易，并会在添加或切换后验证所选网络。

运行 `make sdk-check`，可执行基于测试夹具的单元和打包检查、确定性构建产物验证，以及仅使用构建产物的隔离消费者测试。`make sdk-remote-check` 提供对公开测试网的只读兼容性证明。规范清单及可选的所有者提供分离签名的边界，见 `docs/developers/SDK_RELEASE_INTEGRITY.md`。
