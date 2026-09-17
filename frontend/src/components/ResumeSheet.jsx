import { Fragment } from "react";
import { getTemplate } from "../data/templates";

function Photo({ p, className }) {
  if (!p.photo) return null;
  return (
    <div className={`sheet-photo ${className || ""}`}>
      <img src={p.photo} alt={p.fullName || ""} />
    </div>
  );
}

function skillBarWidth(skill, index) {
  const base = 62 + ((skill.length + index * 7) % 36);
  return Math.min(base, 98);
}

function SkillBars({ skills }) {
  return (
    <div className="sheet-bars">
      {skills.map((s, i) => (
        <div className="bar-row" key={i}>
          <span className="bar-label">{s}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${skillBarWidth(s, i)}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function SkillTags({ skills }) {
  return (
    <div className="sheet-skills">
      {skills.map((s, i) => (
        <span className="sheet-skill" key={i}>
          {s}
        </span>
      ))}
    </div>
  );
}

function Section({ title, children, center }) {
  if (children == null) return null;
  return (
    <section className={`sheet-section ${center ? "sheet-section-center" : ""}`}>
      <h4 className="sheet-heading">{title}</h4>
      {children}
    </section>
  );
}

function ExperienceBlock({ exp }) {
  if (!exp.length) return null;
  return (
    <Section title="Experience">
      {exp.map((e, i) => (
        <div className="sheet-entry" key={i}>
          <div className="sheet-entry-head">
            <strong>{e.company || "Company"}</strong>
            <span>
              {e.startDate || ""}
              {e.startDate ? " – " : ""}
              {e.current ? "Present" : e.endDate || ""}
            </span>
          </div>
          <div className="sheet-entry-sub">
            {e.position || "Position"}
            {e.location ? `  |  ${e.location}` : ""}
          </div>
          {e.description && <p className="sheet-text">{e.description}</p>}
        </div>
      ))}
    </Section>
  );
}

function EducationBlock({ edu }) {
  if (!edu.length) return null;
  return (
    <Section title="Education">
      {edu.map((e, i) => (
        <div className="sheet-entry" key={i}>
          <div className="sheet-entry-head">
            <strong>{e.school || "School"}</strong>
            <span>
              {e.startDate || ""}
              {e.startDate ? " – " : ""}
              {e.endDate || ""}
            </span>
          </div>
          <div className="sheet-entry-sub">
            {e.degree || ""}
            {e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""}
          </div>
          {e.description && <p className="sheet-text">{e.description}</p>}
        </div>
      ))}
    </Section>
  );
}

function ProjectsBlock({ projs }) {
  if (!projs.length) return null;
  return (
    <Section title="Projects">
      {projs.map((pr, i) => (
        <div className="sheet-entry" key={i}>
          <div className="sheet-entry-head">
            <strong>{pr.name || "Project"}</strong>
            {pr.link && <span>{pr.link}</span>}
          </div>
          {pr.techStack && <div className="sheet-entry-sub">{pr.techStack}</div>}
          {pr.description && <p className="sheet-text">{pr.description}</p>}
        </div>
      ))}
    </Section>
  );
}

function CertificationsBlock({ certs }) {
  if (!certs.length) return null;
  return (
    <Section title="Certifications">
      {certs.map((c, i) => (
        <div className="cert-line" key={i}>
          <strong>{c.name}</strong>
          {c.issuer && <span>{c.issuer}</span>}
          {c.year && <span className="cert-year">{c.year}</span>}
        </div>
      ))}
    </Section>
  );
}

function LinksList({ p }) {
  const items = [
    p.website && p.website,
    p.linkedin && p.linkedin,
    p.github && p.github,
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <div className="sheet-links">
      {items.map((lnk, i) => (
        <div key={i}>{lnk}</div>
      ))}
    </div>
  );
}

export default function ResumeSheet({ resume, compact }) {
  const tpl = getTemplate(resume?.template || "modern");
  const p = resume?.personal || {};
  const exp = resume?.experience || [];
  const edu = resume?.education || [];
  const skills = resume?.skills || [];
  const langs = resume?.languages || [];
  const certs = resume?.certifications || [];
  const projs = resume?.projects || [];

  const contactLine = [p.email, p.phone, p.address].filter(Boolean).join("  |  ");

  const profile = p.summary ? <Section title="Profile"><p className="sheet-text">{p.summary}</p></Section> : null;
  const experience = exp.length ? <ExperienceBlock exp={exp} /> : null;
  const education = edu.length ? <EducationBlock edu={edu} /> : null;
  const projects = projs.length ? <ProjectsBlock projs={projs} /> : null;
  const certsBlock = certs.length ? <CertificationsBlock certs={certs} /> : null;
  const langsBlock = langs.length ? <Section title="Languages"><SkillTags skills={langs} /></Section> : null;
  const hasLinks = !!(p.website || p.linkedin || p.github);
  const links = <LinksList p={p} />;

  const sectionMap = { profile, personal: profile, experience, education, projects };
  const DEFAULT_ORDER = ["personal", "experience", "education", "skills", "projects", "certifications", "languages"];
  const order = resume?.sectionOrder?.length ? resume.sectionOrder : DEFAULT_ORDER;
  const mainContent = (
    <>
      {order.map((id) => {
        const el = sectionMap[id];
        if (!el) return null;
        return <Fragment key={id}>{el}</Fragment>;
      })}
    </>
  );

  const headerCenter = (
    <div className="sheet-personal">
      <div className="sheet-name">{(p.fullName || "Your Name").toUpperCase()}</div>
      <div className="sheet-title">{p.jobTitle || "Professional Title"}</div>
      {contactLine && <div className="sheet-contact">{contactLine}</div>}
    </div>
  );

  let body = null;

  switch (tpl.id) {
    case "modern":
      body = (
        <>
          <div className="sheet-personal sheet-personal-has-photo">
            <div className="sheet-name">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="sheet-title">{p.jobTitle || "Professional Title"}</div>
            {contactLine && <div className="sheet-contact">{contactLine}</div>}
          </div>
          <div className="sheet-grid">
            <div className="sheet-main">{mainContent}</div>
            <aside className="sheet-side">
              {skills.length ? <Section title="Skills"><SkillBars skills={skills} /></Section> : null}
              {langsBlock}
              {certsBlock}
              {hasLinks && <Section title="Links">{links}</Section>}
            </aside>
          </div>
        </>
      );
      break;

    case "classic":
      body = (
        <>
          <div className="sheet-personal sheet-personal-classic sheet-personal-has-photo">
            <div className="sheet-name sheet-name-serif">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="sheet-title sheet-title-serif">{p.jobTitle || "Professional Title"}</div>
            {contactLine && <div className="sheet-contact">{contactLine}</div>}
          </div>
          {mainContent}
          {skills.length ? <Section title="Skills"><SkillTags skills={skills} /></Section> : null}
          {langsBlock}
          {certsBlock}
          {hasLinks && <Section title="Professional Links">{links}</Section>}
        </>
      );
      break;

    case "minimal":
      body = (
        <>
          <div className="sheet-personal sheet-personal-left sheet-personal-has-photo">
            <div className="sheet-name">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="sheet-title">{p.jobTitle || "Professional Title"}</div>
            {contactLine && <div className="sheet-contact">{contactLine}</div>}
          </div>
          {mainContent}
          {skills.length ? <Section title="Skills"><SkillTags skills={skills} /></Section> : null}
          {langsBlock}
          {certsBlock}
          {hasLinks && <Section title="Links">{links}</Section>}
        </>
      );
      break;

    case "creative":
      body = (
        <div className="sheet-cgrid">
          <aside className="sheet-cside">
            <div className="c-name">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="c-title">{p.jobTitle || "Professional Title"}</div>
            <div className="c-contact">
              {[p.email, p.phone, p.address].filter(Boolean).map((c, i) => (
                <div key={i}>{c}</div>
              ))}
            </div>
            {skills.length ? (
              <div className="c-block">
                <div className="c-block-title">Skills</div>
                <div className="c-tags">
                  {skills.map((s, i) => (
                    <div className="c-tag" key={i}>{s}</div>
                  ))}
                </div>
              </div>
            ) : null}
            {langsBlock && (
              <div className="c-block">
                <div className="c-block-title">Languages</div>
                <div className="c-tags">{langs.join("  •  ")}</div>
              </div>
            )}
            {hasLinks && (
              <div className="c-block">
                <div className="c-block-title">Links</div>
                <div className="c-links">
                  {[p.website, p.linkedin, p.github].filter(Boolean).map((l, i) => (
                    <div key={i}>{l}</div>
                  ))}
                </div>
              </div>
            )}
          </aside>
          <div className="sheet-cmain">
            {profile}
            {experience}
            {education}
            {projects}
          </div>
        </div>
      );
      break;

    case "professional":
      body = (
        <>
          <div className="sheet-pband sheet-pband-photo">
            <div className="sheet-name">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="sheet-title">{p.jobTitle || "Professional Title"}</div>
            {contactLine && <div className="sheet-contact">{contactLine}</div>}
          </div>
          <div className="sheet-grid">
            <div className="sheet-main">{mainContent}</div>
            <aside className="sheet-side">
              {skills.length ? <Section title="Skills"><SkillTags skills={skills} /></Section> : null}
              {certsBlock}
              {langsBlock}
              {hasLinks && <Section title="Links">{links}</Section>}
            </aside>
          </div>
        </>
      );
      break;

    case "elegant":
      body = (
        <>
          <div className="sheet-personal sheet-personal-elegant">
            <div className="sheet-ornament">
              <span />
              <i>✦</i>
              <span />
            </div>
            <div className="sheet-name sheet-name-serif">{(p.fullName || "Your Name").toUpperCase()}</div>
            <div className="sheet-title sheet-title-serif">{p.jobTitle || "Professional Title"}</div>
            {contactLine && <div className="sheet-contact">{contactLine}</div>}
          </div>
          {mainContent}
          {skills.length ? <Section title="Skills" center><SkillTags skills={skills} /></Section> : null}
          {langsBlock}
          {certsBlock}
          {hasLinks && <Section title="Professional Links" center>{links}</Section>}
        </>
      );
      break;

    default:
      body = (
        <>
          {headerCenter}
          {mainContent}
          {skills.length ? <Section title="Skills"><SkillTags skills={skills} /></Section> : null}
        </>
      );
  }

  return (
    <div
      className={`resume-sheet sheet-${tpl.id} ${compact ? "sheet-compact" : ""}`}
      style={{
        "--accent": tpl.accent,
        "--accent-dark": tpl.dark,
        "--accent-soft": tpl.soft,
      }}
    >
      {body}
    </div>
  );
}