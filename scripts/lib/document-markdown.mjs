import path from 'node:path';

const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
function inline(text, sourcePath, documents) {
  const tokens = [];
  const stash = (value) => `\u0000${tokens.push(value) - 1}\u0000`;
  let result = text.replace(/`([^`]+)`/g, (_, code) => stash(`<code>${escape(code)}</code>`));
  result = result.replace(/\[([^\]]+)\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g, (_, label, url) => {
    let href = url;
    if (!/^(?:https?:|mailto:|#|\/)/i.test(url)) {
      const target = path.posix.normalize(path.posix.join(path.posix.dirname(sourcePath), url.split('#')[0]));
      const targetDocument = documents.find(document => document.sourcePath === target);
      const id = targetDocument?.id;
      if (!id) return stash(escape(label) + ` <code>${escape(url)}</code>`);
      href = `${targetDocument.category === 'whitepaper' ? '/whitepaper' : '/docs'}?doc=${id}`;
    }
    if (!/^(?:https?:\/\/|mailto:|#|\/[^/])/i.test(href)) return stash(escape(label));
    return stash(`<a href="${escape(href)}"${/^https?:/i.test(href) ? ' rel="noreferrer"' : ''}>${escape(label)}</a>`);
  });
  result = escape(result).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  return result.replace(/\u0000(\d+)\u0000/g, (_, index) => tokens[Number(index)]);
}

export function renderDocumentMarkdown(markdown, sourcePath, docId, documents = []) {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const html = [], headings = [];
  const startsBlock = (line) => /^(?:#{1,6}\s|```|~~~|\s*[-*+]\s|\s*\d+[.)]\s|>\s?|\|)/.test(line);
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const fence = line.match(/^\s*(```+|~~~+)(.*)$/);
    if (fence) {
      const code = []; i++;
      while (i < lines.length && !lines[i].trimStart().startsWith(fence[1])) code.push(lines[i++]);
      if (i < lines.length) i++;
      html.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`); continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length, id = `${docId}-section-${headings.length + 1}`;
      const title = heading[2].replace(/[*`]/g, '');
      headings.push({ id, title, level });
      const tag = Math.min(6, level + 1);
      html.push(`<h${tag} id="${id}">${inline(heading[2], sourcePath, documents)}</h${tag}>`); i++; continue;
    }
    if (/^\|/.test(line) && /^\|\s*:?-/.test(lines[i + 1] || '')) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => inline(cell.trim(), sourcePath, documents));
      const head = cells(line); i += 2; const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(cells(lines[i++]));
      html.push(`<div class="documentTable"><table><thead><tr>${head.map(v=>`<th>${v}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`); continue;
    }
    const list = line.match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.+)$/);
    if (list) {
      const ordered = Boolean(list[2]), items=[];
      while (i < lines.length) {
        const item=lines[i].match(/^\s*(?:([-*+])|(\d+)[.)])\s+(.+)$/);
        if (!item || Boolean(item[2]) !== ordered) break;
        const chunks=[item[3]]; i++;
        while (i < lines.length && lines[i].trim() && /^\s+\S/.test(lines[i]) && !startsBlock(lines[i])) chunks.push(lines[i++].trim());
        items.push(chunks.join(' '));
      }
      const tag=ordered?'ol':'ul'; html.push(`<${tag}>${items.map(v=>`<li>${inline(v, sourcePath, documents)}</li>`).join('')}</${tag}>`);continue;
    }
    if (/^>\s?/.test(line)) {
      const quote=[];while(i<lines.length&&/^>\s?/.test(lines[i]))quote.push(lines[i++].replace(/^>\s?/,''));
      html.push(`<blockquote>${inline(quote.join(' '),sourcePath,documents)}</blockquote>`);continue;
    }
    if (/^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line)) {html.push('<hr />');i++;continue;}
    const paragraph=[line];i++;
    while(i<lines.length&&lines[i].trim()&&!startsBlock(lines[i]))paragraph.push(lines[i++]);
    html.push(`<p>${inline(paragraph.join(' '), sourcePath, documents)}</p>`);
  }
  return { html:html.join('\n'), headings };
}

