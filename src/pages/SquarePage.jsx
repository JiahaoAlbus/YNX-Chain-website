import React, { useCallback, useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Clock3, MessageCircle, RefreshCw, ShieldCheck, UserRound } from "lucide-react";
import { SquareAccountPanel } from "../components/SquareAccountPanel.jsx";

export function SquarePage({ path }) {
  const postId = path.startsWith("/square/") ? decodeURIComponent(path.slice("/square/".length)) : "";
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [updatedAt, setUpdatedAt] = useState("");

  const refresh = useCallback(async () => {
    setState("loading");
    const endpoint = postId ? `/api/apps/square/post?id=${encodeURIComponent(postId)}` : "/api/apps/square/feed?limit=30";
    try {
      const response = await fetch(endpoint, { cache: "no-store" });
      const raw = await response.text();
      let body;
      try { body = JSON.parse(raw); } catch { throw new Error("The live Square service returned an invalid response."); }
      if (!response.ok || body.error) throw new Error(body.error || `HTTP ${response.status}`);
      setData(body);
      setUpdatedAt(new Date().toISOString());
      setState("ready");
    } catch (error) {
      setData({ error: error.message });
      setState("error");
    }
  }, [postId]);

  useEffect(() => { refresh(); }, [refresh]);

  const posts = Array.isArray(data?.posts) ? data.posts : [];
  return (
    <main className="squarePage">
      <header className="squareHeader">
        <div>
          {postId && <a className="squareBack" href="/square"><ArrowLeft /> Feed</a>}
          <p className="sectionEyebrow">Public testnet social layer</p>
          <h1>YNX Square</h1>
          <p>Persisted public records from the deployed Square service.</p>
        </div>
        <div className="squareControls">
          <span className={`squareConnection ${state}`}><i />{state === "ready" ? "Connected" : state === "error" ? "Unavailable" : "Loading"}</span>
          <button className="iconButton" onClick={refresh} disabled={state === "loading"} aria-label="Refresh Square" title="Refresh Square"><RefreshCw className={state === "loading" ? "spinning" : ""} /></button>
        </div>
      </header>

      <div className="squareBoundary"><ShieldCheck /><span><strong>Public reads live · signed writes beta</strong>Publishing requires a local encrypted YNX vault, chain-account ownership proof, and a device-signed session. Private keys never enter the Gateway.</span>{updatedAt && <time dateTime={updatedAt}>Updated {formatTime(updatedAt)}</time>}</div>

      {!postId && <SquareAccountPanel onPublished={refresh} />}

      {state === "loading" && <section className="squareLoading" aria-live="polite"><span /><span /><span /></section>}
      {state === "error" && <section className="squareEmpty error" aria-live="polite"><AlertCircle /><h2>Square is unavailable</h2><p>{data?.error || "The live feed could not be reached."}</p><button className="button primary" onClick={refresh}>Try again</button></section>}
      {state === "ready" && postId && <PostDetail data={data} />}
      {state === "ready" && !postId && posts.length === 0 && <section className="squareEmpty"><MessageCircle /><h2>The public feed is empty.</h2><p>No sample posts are inserted. A post appears only after a user completes local vault backup, account ownership verification, and device-signed publishing.</p></section>}
      {state === "ready" && !postId && posts.length > 0 && <section className="squareFeed" aria-label="Square public feed">{posts.map((post) => <Post key={post.id} post={post} />)}</section>}
    </main>
  );
}

function Post({ post }) {
  return (
    <article className="squarePost">
      <div className="postMeta"><span className="postAvatar"><UserRound /></span><span><strong>{shortAccount(post.author || post.account)}</strong><small>{formatDate(post.createdAt)}</small></span></div>
      <p>{post.content}</p>
      {Array.isArray(post.tags) && post.tags.length > 0 && <div className="postTags">{post.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>}
      <div className="postStats"><span><MessageCircle />{post.commentCount || 0}</span><span><Clock3 />Persisted</span><a href={`/square/${encodeURIComponent(post.id)}`}>Open post</a></div>
    </article>
  );
}

function PostDetail({ data }) {
  const comments = Array.isArray(data.comments) ? data.comments : [];
  if (!data.post) return <section className="squareEmpty error"><AlertCircle /><h2>Post not found</h2><p>The requested persisted record is unavailable.</p></section>;
  return <section className="postDetail"><Post post={data.post} /><div className="commentList"><h2>Comments</h2>{comments.length ? comments.map((comment) => <article key={comment.id}><strong>{shortAccount(comment.author || comment.account)}</strong><p>{comment.content}</p><small>{formatDate(comment.createdAt)}</small></article>) : <p className="commentEmpty">No persisted comments.</p>}</div></section>;
}

function shortAccount(value = "Unknown account") { return value.length > 22 ? `${value.slice(0, 12)}…${value.slice(-7)}` : value; }
function formatDate(value) { return value ? new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "Timestamp unavailable"; }
function formatTime(value) { return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)); }
