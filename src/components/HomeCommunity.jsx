import React from "react";
import { ArrowUpRight, MessageCircle, Youtube, Github } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { COMMUNITY_LINKS, getHomeEntryCopy } from "../content/homeEntryContent.js";
import "./HomeCommunity.css";

export function HomeCommunity() {
  const { locale } = useLocale();
  const copy = getHomeEntryCopy(locale);
  return <section className="homeCommunity" id="community" aria-labelledby="community-title">
    <div className="communityIntro"><p className="sectionEyebrow">{copy.eyebrow}</p><h2 id="community-title">{copy.title}</h2><p>{copy.lead}</p></div>
    <div className="communityDestinations">
      <a className="communityPrimary" href={COMMUNITY_LINKS.discord} target="_blank" rel="noopener noreferrer"><MessageCircle size={30} strokeWidth={1.5}/><span><strong>Discord</strong><p>{copy.discordDescription}</p><span className="communityAction">{copy.discordAction}<ArrowUpRight size={18}/></span></span></a>
      <a className="communityPrimary" href={COMMUNITY_LINKS.youtube} target="_blank" rel="noopener noreferrer"><Youtube size={30} strokeWidth={1.5}/><span><strong>YouTube</strong><p>{copy.youtubeDescription}</p><span className="communityAction">{copy.youtubeAction}<ArrowUpRight size={18}/></span></span></a>
      <a className="communitySecondary" href={COMMUNITY_LINKS.x} target="_blank" rel="noopener noreferrer"><span className="communityX" aria-hidden="true">𝕏</span><span><strong>X</strong><small>{copy.xDescription}</small></span><ArrowUpRight size={19}/></a>
      <a className="communitySecondary" href={COMMUNITY_LINKS.github} target="_blank" rel="noopener noreferrer"><Github size={23}/><span><strong>GitHub</strong><small>{copy.githubDescription}</small></span><ArrowUpRight size={19}/></a>
    </div>
  </section>;
}
