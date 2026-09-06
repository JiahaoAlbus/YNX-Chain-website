import React, { useId, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "../lib/i18n.jsx";
import { getHomeExperienceCopy } from "../content/homeExperienceContent.js";
import "./HomeExperience.css";

export function HomeExperience() {
  const { locale } = useLocale();
  const copy = getHomeExperienceCopy(locale);
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState(0);
  const tabs = useRef([]);
  const id = useId();
  const rtl = locale === "ar";
  const glossary = copy.glossary[selectedTerm];

  const navigateTabs = (event, index) => {
    let next;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = copy.tabs.length - 1;
    else if (event.key === "ArrowRight") next = (index + (rtl ? -1 : 1) + copy.tabs.length) % copy.tabs.length;
    else if (event.key === "ArrowLeft") next = (index + (rtl ? 1 : -1) + copy.tabs.length) % copy.tabs.length;
    else return;
    event.preventDefault();
    setSelectedTab(next);
    tabs.current[next]?.focus({ preventScroll: true });
  };

  return <section className="experienceSection" id="experience" dir={rtl ? "rtl" : "ltr"} aria-labelledby={`${id}-title`}>
    <div className="experienceInner">
      <header className="experienceHeader">
        <p className="experienceEyebrow">{copy.eyebrow}</p>
        <h2 id={`${id}-title`}>{copy.title}</h2>
        <p className="experienceLead">{copy.lead}</p>
      </header>

      <div className="experienceTabs" role="tablist" aria-labelledby={`${id}-title`} aria-orientation="horizontal">
        {copy.tabs.map((tab, index) => <button key={index} ref={element => { tabs.current[index] = element; }}
          className="experienceTab" type="button" role="tab" id={`${id}-tab-${index}`}
          aria-selected={selectedTab === index} aria-controls={`${id}-panel-${index}`}
          tabIndex={selectedTab === index ? 0 : -1}
          onClick={() => setSelectedTab(index)} onKeyDown={event => navigateTabs(event, index)}>
          {tab.label}
        </button>)}
      </div>

      {copy.tabs.map((tab, index) => <div key={index} className="experiencePanel" role="tabpanel"
        id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0} hidden={selectedTab !== index}>
        <div className="experienceIntroduction">
          <h3>{tab.title}</h3>
          <p>{tab.description}</p>
        </div>
        <ol className="experienceSteps" role="list">
          {tab.steps.map((step, stepIndex) => <li className="experienceStep" key={stepIndex}>
            <span className="experienceStepNumber" aria-hidden="true">{String(stepIndex + 1).padStart(2, "0")}</span>
            <div className="experienceStepContent">
              <h4>{step.title}</h4>
              <p>{step.text}</p>
              <a className="experienceStepAction" href={step.href}>{step.action}<ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </li>)}
        </ol>
      </div>)}

      <div className="experienceGlossary">
        <h3 id={`${id}-glossary-title`}>{copy.glossaryTitle}</h3>
        <div className="experienceTerms" role="group" aria-labelledby={`${id}-glossary-title`}>
          {copy.glossary.map((item, index) => <button className="experienceTerm" type="button" key={index}
            aria-pressed={selectedTerm === index} aria-controls={`${id}-definition`} onClick={() => setSelectedTerm(index)}>
            <bdi dir="ltr">{item.term}</bdi>
          </button>)}
        </div>
        <p className="experienceDefinition" id={`${id}-definition`} role="status" aria-live="polite" aria-atomic="true">
          <strong><bdi dir="ltr">{glossary.term}</bdi></strong>{" "}<span>{glossary.definition}</span>
        </p>
      </div>
    </div>
  </section>;
}
