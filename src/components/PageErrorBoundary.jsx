import React from "react";

export class PageErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main id="main-content" className="routePage" tabIndex={-1}>
      <div className="routeInner" role="alert">
        <h1>This page could not load</h1>
        <p>Check your connection and try again. Your wallet remains under your control.</p>
        <button type="button" className="button primary" onClick={() => window.location.reload()}>Retry</button>
        <a className="button" href="/">Back to home</a>
      </div>
    </main>;
  }
}
