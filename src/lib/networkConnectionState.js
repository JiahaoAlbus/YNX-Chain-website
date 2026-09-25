export function networkConnectionState(snapshot, awaitingSecondSample) {
  if (snapshot?.error || snapshot?.status?.error) return "error";
  if (awaitingSecondSample) {
    return snapshot?.chainVerified === true && snapshot?.indexerVerified === true ? "loading" : "error";
  }
  return snapshot?.ok === true ? "live" : "error";
}
