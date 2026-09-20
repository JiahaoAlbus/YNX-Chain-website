import React, { useState } from "react";
import { ArrowRightLeft, Check, CircleAlert, Copy, ExternalLink, WalletCards } from "lucide-react";
import { apiConfig } from "../lib/api/ynxApi.js";
import { normalizeAddress } from "../lib/address.js";
import { useLocale } from "../lib/i18n.jsx";
import { getAddressConverterCopy } from "../content/addressConverterContent.js";

export function AddressConverter() {
  const { locale } = useLocale();
  const labels = getAddressConverterCopy(locale);
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
      setError(conversionError.message === "YNX address checksum is invalid." ? "checksum"
        : conversionError.message === "YNX address cannot mix uppercase and lowercase." ? "mixedCase" : "invalid");
    }
  };

  const copy = async (type, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(""), 1400);
    } catch {
      setError("clipboard");
    }
  };

  return (
    <section className="addressSection" id="address" aria-labelledby="address-title" data-reveal>
      <div className="addressIntro">
        <p className="sectionEyebrow">{labels.eyebrow}</p>
        <h2 id="address-title">{labels.title}</h2>
        <p>{labels.lead}</p>
        <div className="addressBoundary"><WalletCards size={19} /><span>{labels.boundary}</span></div>
      </div>

      <form className="addressTool" onSubmit={convert} noValidate>
        <label htmlFor="address-input">{labels.inputLabel}</label>
        <div className={`addressInputRow ${error ? "hasError" : ""}`}>
          <input
            id="address-input"
            value={input}
            onChange={(event) => { setInput(event.target.value); setError(""); setResult(null); }}
            placeholder={labels.placeholder}
            dir="ltr"
            autoComplete="off"
            spellCheck="false"
          />
          <button type="submit" disabled={!input.trim()}><ArrowRightLeft size={18} /> {labels.convert}</button>
        </div>
        {error && <p className="addressError" role="alert"><CircleAlert size={16} />{labels.errors[error]}</p>}
        {result && <div className="addressResults" aria-live="polite">
          <AddressOutput label={labels.nativeLabel} value={result.ynxAddress} type="ynx" copied={copied} onCopy={copy} labels={labels} />
          <AddressOutput label={labels.compatibilityLabel} value={result.evmAddress} type="evm" copied={copied} onCopy={copy} labels={labels} />
          <a className="addressExplorer" href={`${apiConfig.explorerUrl}/api/accounts/${result.ynxAddress}`}>
            {labels.explorer} <ExternalLink size={16} />
          </a>
        </div>}
      </form>
    </section>
  );
}

function AddressOutput({ label, value, type, copied, onCopy, labels }) {
  const isCopied = copied === type;
  const title = `${isCopied ? labels.copied : labels.copy}: ${label}`;
  return <div className="addressOutput"><span>{label}</span><code dir="ltr">{value}</code><button type="button" onClick={() => onCopy(type, value)} aria-label={title} title={title}>{isCopied ? <Check size={17} /> : <Copy size={17} />}</button></div>;
}
