import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
export function GuideCode({ code, title = "shell", ui }) {
  const [status, setStatus] = useState({code:"",result:""});
  const copied = status.code === code ? status.result : "";
  async function copy() { try { await navigator.clipboard.writeText(code); setStatus({code,result:"ok"}); } catch { setStatus({code,result:"error"}); } }
  return <div className="guideCodeBlock"><div className="guideCodeToolbar"><span>{title}</span><button type="button" onClick={copy}>{copied === "ok" ? <Check size={16} /> : <Copy size={16} />}{copied === "ok" ? ui.copied : ui.copy}</button></div><pre tabIndex="0" dir="ltr"><code>{code}</code></pre><span className="guideCopyStatus" role="status">{copied === "error" ? ui.copyError : ""}</span></div>;
}
