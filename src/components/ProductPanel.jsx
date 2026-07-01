export function ProductPanel({ icon, title, text, statusEndpoint }) {
  return (
    <article className="product">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      <code>{statusEndpoint}</code>
    </article>
  );
}
