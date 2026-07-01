import { Activity, WalletCards } from "lucide-react";

export function Hero({ onAddNetwork, onSwitchNetwork }) {
  return (
    <section className="hero">
      <div className="heroInner">
        <p className="eyebrow">Web4 L1 infrastructure</p>
        <h1>YNX Chain</h1>
        <p className="sub">
          AI-native, payment-native, resource-native, Trust-native infrastructure for YNXT settlement and verifiable developer workflows.
        </p>
        <div className="actions">
          <button onClick={onAddNetwork}><WalletCards size={18} /> Add YNX Testnet</button>
          <button onClick={onSwitchNetwork}><Activity size={18} /> Switch Network</button>
        </div>
      </div>
    </section>
  );
}
