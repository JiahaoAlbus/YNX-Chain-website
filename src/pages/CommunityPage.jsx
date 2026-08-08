import React from "react";
import { ArrowUpRight, MessageCircle, PlaySquare, Radio, Users } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";

export const communityChannels = [
  {
    name: "Discord",
    href: "https://discord.gg/t8KpAF2KE",
    icon: MessageCircle,
    en: "Real-time discussion, testnet support, bug reports and contributor coordination.",
    zh: "实时讨论、测试网支持、问题反馈与贡献者协作。",
  },
  {
    name: "Reddit",
    href: "https://www.reddit.com/r/YNX_Chain/",
    icon: Users,
    en: "Long-form community discussion, proposals, tutorials and ecosystem feedback.",
    zh: "长篇社区讨论、提案、教程与生态反馈。",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@YNX-Chain",
    icon: PlaySquare,
    en: "Product demonstrations, testnet walkthroughs and public progress updates.",
    zh: "产品演示、测试网操作指南与公开进展更新。",
  },
  {
    name: "X",
    href: "https://x.com/YNXChain",
    icon: Radio,
    en: "Release notices, service updates and short-form announcements.",
    zh: "版本通知、服务动态与简短公告。",
  },
];

export function CommunityPage() {
  const { locale } = useLocale();
  const zh = locale === "zh-CN";
  return (
    <main className="communityPage">
      <section className="communityHero" aria-labelledby="community-title">
        <p className="sectionEyebrow">{zh ? "官方社区" : "Official community"}</p>
        <h1 id="community-title">{zh ? "参与 YNX Chain 的公开建设" : "Join the public build of YNX Chain"}</h1>
        <p>{zh ? "选择适合你的社区入口，获取测试网帮助、报告问题、讨论产品并跟踪发布。所有链接均指向 YNX Chain 官方公开频道。" : "Choose the channel that fits your needs: get testnet help, report issues, discuss products, and follow releases. Every link below is an official public YNX Chain channel."}</p>
      </section>
      <section className="communityGrid" aria-label={zh ? "官方社区频道" : "Official community channels"}>
        {communityChannels.map(({ name, href, icon: Icon, en, zh: description }) => (
          <a className="communityCard" href={href} target="_blank" rel="noopener noreferrer" key={name}>
            <span className="communityIcon"><Icon /></span>
            <span><strong>{name}</strong><small>{zh ? description : en}</small></span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </section>
      <section className="communityRules" aria-labelledby="community-rules-title">
        <div>
          <p className="sectionEyebrow">{zh ? "参与方式" : "How to participate"}</p>
          <h2 id="community-rules-title">{zh ? "从真实测试与可复现证据开始" : "Start with real tests and reproducible evidence"}</h2>
        </div>
        <ol>
          <li>{zh ? "使用公开测试网或已标记为可用的生态产品。" : "Use the public testnet or an ecosystem product explicitly marked available."}</li>
          <li>{zh ? "反馈时附上产品、平台、时间、操作步骤和可公开的错误信息。" : "Include the product, platform, time, reproduction steps, and non-sensitive error details."}</li>
          <li>{zh ? "不要发布私钥、助记词、密码、访问令牌或其他敏感信息。" : "Never post private keys, seed phrases, passwords, access tokens, or other secrets."}</li>
          <li>{zh ? "测试网资产没有承诺的现实货币价值；请以官网就绪度和风险边界为准。" : "Testnet assets have no promised real-world monetary value; follow the website readiness and risk boundaries."}</li>
        </ol>
      </section>
    </main>
  );
}
