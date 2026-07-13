import React, { useState } from "react";
import { ArrowRightLeft, Check, CircleAlert, Copy, ExternalLink, WalletCards } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { normalizeAddress } from "../lib/address.js";

export function AddressConverter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const convert = (event) => {
    event.preventDefault();
    try {
      setResult(normalizeAddress(input));
      setError("");
    } catch (conversionError) {
      setResult(null);
      setError(conversionError.message);
    }
  };

  const copy = async (type, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(""), 1400);
    } catch {
      setError("Clipboard access is unavailable.");
    }
  };

  return (
    <section className="addressSection" id="address" aria-labelledby="address-title" data-reveal>
      <div className="addressIntro">
        <p className="sectionEyebrow">YNX account identity</p>
        <h2 id="address-title">One account. Two verified formats.</h2>
        <p>The YNX-native alias and EVM address encode the same 20 account bytes. Assets, keys, and account state do not change during conversion.</p>
        <div className="addressBoundary"><WalletCards size={19} /><span>MetaMask, Solidity, and EVM JSON-RPC continue to use the canonical <code>0x...</code> form.</span></div>
      </div>

      <form className="addressTool" onSubmit={convert} noValidate>
        <label htmlFor="address-input">Account address</label>
        <div className={`addressInputRow ${error ? "hasError" : ""}`}>
          <input
            id="address-input"
            value={input}
            onChange={(event) => { setInput(event.target.value); setError(""); setResult(null); }}
            placeholder="0x... or ynx1..."
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" disabled={!input.trim()}><ArrowRightLeft size={18} /> Convert</button>
        </div>
        {error && <p className="addressError" role="alert"><CircleAlert size={16} />{error}</p>}
        {result && <div className="addressResults" aria-live="polite">
          <AddressOutput label="EVM / MetaMask" value={result.evmAddress} type="evm" copied={copied} onCopy={copy} />
          <AddressOutput label="YNX native" value={result.ynxAddress} type="ynx" copied={copied} onCopy={copy} />
          <a className="addressExplorer" href={`${apiConfig.explorerUrl}/api/accounts/${result.ynxAddress}`}>
            Verify this account in Explorer <ExternalLink size={16} />
          </a>
        </div>}
      </form>
    </section>
  );
}

function AddressOutput({ label, value, type, copied, onCopy }) {
  const isCopied = copied === type;
  const title = isCopied ? `${label} copied` : `Copy ${label}`;
  return <div className="addressOutput"><span>{label}</span><code>{value}</code><button type="button" onClick={() => onCopy(type, value)} aria-label={title} title={title}>{isCopied ? <Check size={17} /> : <Copy size={17} />}</button></div>;
}
