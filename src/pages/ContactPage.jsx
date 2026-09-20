import React from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { FOUNDER_EMAIL, getContactCopy } from "../content/contactLocaleContent.js";
import { HomeCommunity } from "../components/HomeCommunity.jsx";
import "./ContactPage.css";

export function ContactPage() {
  const { locale } = useLocale();
  const copy = getContactCopy(locale);
  return <main className="contactPage">
    <header className="contactIntro"><p className="sectionEyebrow">{copy.nav}</p><h1>{copy.title}</h1><p>{copy.lead}</p></header>
    <section className="founderContact" aria-labelledby="founder-contact-title"><Mail size={36} strokeWidth={1.5}/><div><h2 id="founder-contact-title">{copy.founder}</h2><p>{copy.emailLead}</p><a className="founderAddress" href={`mailto:${FOUNDER_EMAIL}`}><bdi>{FOUNDER_EMAIL}</bdi></a><p className="emailHint">{copy.emailHint}</p></div><a className="button primary" href={`mailto:${FOUNDER_EMAIL}`}>{copy.emailAction}<ArrowUpRight size={18}/></a></section>
    <HomeCommunity />
  </main>;
}
