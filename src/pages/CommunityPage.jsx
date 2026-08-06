import React from "react";
import { ArrowLeft, ArrowUpRight, BookOpen, Github, MessageCircle, MessagesSquare, ShieldCheck, Twitter, Youtube } from "lucide-react";

const channels = [
  {
    name: "Discord",
    href: "https://discord.gg/t8KpAF2KE",
    icon: MessagesSquare,
    description: "Real-time discussion, builder support, and build-in-public updates from the core team.",
  },
  {
    name: "X",
    href: "https://x.com/YNXChain",
    icon: Twitter,
    description: "Announcements, release notes, and public testnet progress as it happens.",
  },
  {
    name: "Reddit",
    href: "https://www.reddit.com/r/YNX_Chain/",
    icon: MessageCircle,
    description: "Long-form discussion, questions, and community threads about the YNX ecosystem.",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@YNX-Chain",
    icon: Youtube,
    description: "Walkthroughs, demos, and public testnet evidence videos.",
  },
  {
    name: "GitHub",
    href: "https://github.com/JiahaoAlbus/YNX-Chain",
    icon: Github,
    description: "Source code, issues, and pull requests. Contributions and reviews are welcome.",
  },
  {
    name: "Documentation",
    href: "/docs",
    icon: BookOpen,
    description: "Developer docs, SDKs, and evidence-linked public documentation.",
    internal: true,
  },
];

export function CommunityPage() {
  return (
    <main className="routePage communityPage">
      <div className="routeInner">
        <a className="backLink" href="/"><ArrowLeft size={17} /> YNX Chain</a>
        <p className="sectionEyebrow">Community</p>
        <h1>Build in public with the YNX community.</h1>
        <p className="routeLead">
          YNX Chain is developed in the open. Developers, researchers, and creators can follow the
          public testnet, review the code, and join the conversation on every official channel.
        </p>
        <div className="communityGrid">
          {channels.map(({ name, href, icon: Icon, description, internal }) => (
            <a
              key={name}
              className="communityCard"
              href={href}
              rel={internal ? undefined : "noopener"}
            >
              <span className="communityIcon"><Icon size={22} /></span>
              <strong>{name}</strong>
              <p>{description}</p>
              <span className="communityAction">
                {internal ? "Open docs" : "Join"} <ArrowUpRight size={15} />
              </span>
            </a>
          ))}
        </div>
        <aside className="evidenceBoundary communityBoundary">
          <ShieldCheck />
          <div>
            <strong>Official channels only.</strong>
            <p>
              The links above are the only official YNX community entry points. Never share
              mnemonics, private keys, or custody material in any community channel — no team
              member will ever ask for them.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
