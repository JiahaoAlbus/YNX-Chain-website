export function StatusCard({ icon, title, data, value, label, endpoint, lastChecked }) {
  const error = data?.error;
  return (
    <article className={`card ${error ? "error" : ""}`}>
      <div className="cardTop">{icon}<span>{title}</span></div>
      {error ? (
        <>
          <strong>Service unavailable</strong>
          <p>{endpoint}</p>
          <p>{error}</p>
          <p>{data.checkedAt}</p>
        </>
      ) : (
        <>
          <strong>{value ?? "loading"}</strong>
          <p>{label}</p>
          <p>{endpoint}</p>
          <p>{lastChecked}</p>
        </>
      )}
    </article>
  );
}
