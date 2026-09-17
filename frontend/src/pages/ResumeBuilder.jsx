import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaCogs,
  FaProjectDiagram,
  FaCertificate,
  FaLanguage,
  FaPlus,
  FaTimes,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { resumeAPI, userAPI } from "../services/api";
import ResumeSheet from "../components/ResumeSheet";
import {
  TEMPLATES,
  getTemplate,
  getDefaultTemplate,
  saveDefaultTemplate,
} from "../data/templates";

const emptyPersonal = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  linkedin: "",
  summary: "",
  photo: "",
};

const emptyResume = {
  title: "Untitled Resume",
  template: getDefaultTemplate(),
  personal: { ...emptyPersonal },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  sectionOrder: ["personal", "experience", "education", "skills", "projects", "certifications", "languages"],
};

const SECTIONS = [
  { id: "personal", label: "Personal Details", icon: <FaUser /> },
  { id: "experience", label: "Work Experience", icon: <FaBriefcase /> },
  { id: "education", label: "Education", icon: <FaGraduationCap /> },
  { id: "skills", label: "Skills", icon: <FaCogs /> },
  { id: "projects", label: "Projects", icon: <FaProjectDiagram /> },
  { id: "certifications", label: "Certifications", icon: <FaCertificate /> },
  { id: "languages", label: "Languages", icon: <FaLanguage /> },
];

const DEFAULT_SECTION_ORDER = ["personal", "experience", "education", "skills", "projects", "certifications", "languages"];

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [resume, setResume] = useState(JSON.parse(JSON.stringify(emptyResume)));
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(id !== "new");
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [defaultMsg, setDefaultMsg] = useState("");

  const pickTemplate = (tplId) => {
    setResume({ ...resume, template: tplId });
    saveDefaultTemplate(tplId);
    userAPI.updateProfile({ defaultTemplate: tplId }).catch(() => {});
    const tpl = getTemplate(tplId);
    setDefaultMsg(`"${tpl.name}" set as your default template`);
    setTimeout(() => setDefaultMsg(""), 2800);
  };

  useEffect(() => {
    if (id && id !== "new") {
      loadResume(id);
    } else {
      const draft = JSON.parse(JSON.stringify(emptyResume));
      setResume({
        ...draft,
        title: location.state?.title || draft.title,
        template: location.state?.template || draft.template,
        personal: { ...draft.personal },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadResume = async (rid) => {
    setLoading(true);
    try {
      const res = await resumeAPI.getById(rid);
      const data = res.data.resume;
      const known = new Set(SECTIONS.map((s) => s.id));
      const validOrder = (data.sectionOrder || DEFAULT_SECTION_ORDER).filter((id) => known.has(id));
      DEFAULT_SECTION_ORDER.forEach((id) => {
        if (!validOrder.includes(id)) validOrder.push(id);
      });
      setResume({
        ...emptyResume,
        ...data,
        sectionOrder: validOrder,
        personal: { ...emptyPersonal, ...(data.personal || {}) },
        experience: data.experience || [],
        education: data.education || [],
        skills: data.skills || [],
        languages: data.languages || [],
        certifications: data.certifications || [],
        projects: data.projects || [],
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load resume");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonal = (field, value) => {
    setResume((r) => ({ ...r, personal: { ...r.personal, [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSavedMsg("");
    setSaveError("");
    const personal = resume.personal || {};
    const hasPersonal = (personal.fullName && personal.fullName.trim()) || (personal.email && personal.email.trim());
    if (!resume.title.trim()) {
      setSaveError("Please enter a resume title.");
      setSaving(false);
      return;
    }
    if (!hasPersonal) {
      setSaveError("Personal Details are required to save — add at least your full name or email.");
      setActiveSection("personal");
      setSaving(false);
      return;
    }
    if (!resume.education?.some((e) => (e.school || "").trim())) {
      setSaveError("Education is required to save — add at least one entry with a school.");
      setActiveSection("education");
      setSaving(false);
      return;
    }
    if (!resume.skills?.length) {
      setSaveError("Skills are required — add at least one skill.");
      setActiveSection("skills");
      setSaving(false);
      return;
    }
    try {
      const payload = {
        title: resume.title,
        template: resume.template,
        personal: resume.personal,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        languages: resume.languages,
        certifications: resume.certifications,
        projects: resume.projects,
        sectionOrder: resume.sectionOrder,
      };

      if (id && id !== "new") {
        await resumeAPI.update(id, payload);
      } else {
        await resumeAPI.create(payload);
      }
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save resume");
    } finally {
      setSaving(false);
    }
  };

  function updateArrayItem(section, idx, field, value) {
    setResume((r) => ({
      ...r,
      [section]: r[section].map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    }));
  }

  function removeItem(section, idx) {
    setResume((r) => ({ ...r, [section]: r[section].filter((_, i) => i !== idx) }));
  }

  if (loading) {
    return (
      <div className="builder-loading">
        <FaSpinner className="spin" size={36} />
        <p>Loading resume...</p>
      </div>
    );
  }

  const sectionOrder = resume.sectionOrder || DEFAULT_SECTION_ORDER;

  return (
    <div className="builder">
      <div className="builder-bar">
        <button className="btn btn-ghost" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back
        </button>

        <div className="builder-title">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume({ ...resume, title: e.target.value })}
            placeholder="Resume title"
          />
        </div>

        <div className="builder-actions">
          <span className="builder-save-status">
            {savedMsg && <span className="save-msg">{savedMsg}</span>}
            {saveError && <span className="save-error">{saveError}</span>}
          </span>
          <button className="btn btn-ghost" onClick={() => setShowPreview(true)}>
            <FaEye /> Preview
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <FaSpinner className="spin" /> : <FaSave />}
            Save
          </button>
        </div>
      </div>

      <div className="builder-layout">
        <aside className="builder-nav">
          <div className="builder-section-list">
            {(resume.sectionOrder || DEFAULT_SECTION_ORDER).map((sid) => {
              const sec = SECTIONS.find((s) => s.id === sid);
              if (!sec) return null;
              return (
                <div
                  key={sid}
                  onClick={() => setActiveSection(sid)}
                  className={`builder-nav-item ${activeSection === sid ? "active" : ""}`}
                >
                  <span className="builder-nav-icon">{sec.icon}</span>
                  <span className="builder-nav-label">{sec.label}</span>
                </div>
              );
            })}
          </div>

          <div className="builder-templates">
            <div className="builder-templates-label">Template</div>
            <div className="template-picker">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  title={t.tagline}
                  className={`template-chip ${resume.template === t.id ? "active" : ""}`}
                  onClick={() => pickTemplate(t.id)}
                >
                  <span className="chip-dot" style={{ background: t.accent }} />
                  {t.name}
                </button>
              ))}
            </div>
            <div className="builder-default">
              <p className="builder-default-hint">
                Choosing a template sets it as the default for every new resume.
              </p>
              {defaultMsg && <p className="builder-default-msg">{defaultMsg}</p>}
            </div>
          </div>
        </aside>

        <main className="builder-main">
          {activeSection === "personal" && (
            <section className="builder-section">
              <h2>Personal Details</h2>
              <p className="section-desc">Your name, contact info, and a brief professional summary.</p>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={resume.personal.fullName}
                    onChange={(e) => updatePersonal("fullName", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Job Title</label>
                  <input
                    type="text"
                    value={resume.personal.jobTitle}
                    onChange={(e) => updatePersonal("jobTitle", e.target.value)}
                    placeholder="Frontend Developer"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={resume.personal.email}
                    onChange={(e) => updatePersonal("email", e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={resume.personal.phone}
                    onChange={(e) => updatePersonal("phone", e.target.value)}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={resume.personal.address}
                    onChange={(e) => updatePersonal("address", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={resume.personal.website}
                    onChange={(e) => updatePersonal("website", e.target.value)}
                    placeholder="https://portfolio.com"
                  />
                </div>
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={resume.personal.linkedin}
                    onChange={(e) => updatePersonal("linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Professional Summary</label>
                <textarea
                  rows="5"
                  value={resume.personal.summary}
                  onChange={(e) => updatePersonal("summary", e.target.value)}
                  placeholder="A brief summary of your experience, skills, and career goals..."
                />
              </div>
            </section>
          )}

          {activeSection === "experience" && (
            <section className="builder-section">
              <h2>Work Experience</h2>
              <p className="section-desc">Add your relevant work history, most recent first.</p>

              {resume.experience.map((exp, idx) => (
                <div className="entry-card" key={idx}>
                  <div className="entry-card-header">
                    <h4>Experience #{idx + 1}</h4>
                    <button className="icon-btn danger" onClick={() => removeItem("experience", idx)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateArrayItem("experience", idx, "company", e.target.value)}
                        placeholder="Company name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateArrayItem("experience", idx, "position", e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateArrayItem("experience", idx, "location", e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateArrayItem("experience", idx, "startDate", e.target.value)}
                        placeholder="Jan 2020"
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateArrayItem("experience", idx, "endDate", e.target.value)}
                        placeholder="Present"
                        disabled={exp.current}
                      />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateArrayItem("experience", idx, "current", e.target.checked)}
                        />
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows="4"
                      value={exp.description}
                      onChange={(e) => updateArrayItem("experience", idx, "description", e.target.value)}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline add-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    experience: [...resume.experience, { company: "", position: "", location: "", startDate: "", endDate: "", current: false, description: "" }],
                  })
                }
              >
                <FaPlus /> Add Experience
              </button>
            </section>
          )}

          {activeSection === "education" && (
            <section className="builder-section">
              <h2>Education</h2>
              <p className="section-desc">Add your academic background and degrees.</p>

              {resume.education.map((edu, idx) => (
                <div className="entry-card" key={idx}>
                  <div className="entry-card-header">
                    <h4>Education #{idx + 1}</h4>
                    <button className="icon-btn danger" onClick={() => removeItem("education", idx)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>School / University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateArrayItem("education", idx, "school", e.target.value)}
                        placeholder="University name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateArrayItem("education", idx, "degree", e.target.value)}
                        placeholder="Bachelor of Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateArrayItem("education", idx, "fieldOfStudy", e.target.value)}
                        placeholder="Computer Science"
                      />
                    </div>
                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateArrayItem("education", idx, "startDate", e.target.value)}
                        placeholder="2016"
                      />
                    </div>
                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateArrayItem("education", idx, "endDate", e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={edu.description}
                      onChange={(e) => updateArrayItem("education", idx, "description", e.target.value)}
                      placeholder="Achievements, honors, relevant coursework..."
                    />
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline add-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    education: [...resume.education, { school: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "", description: "" }],
                  })
                }
              >
                <FaPlus /> Add Education
              </button>
            </section>
          )}

          {activeSection === "skills" && (
            <section className="builder-section">
              <h2>Skills</h2>
              <p className="section-desc">Add the skills that set you apart from other candidates.</p>

              <div className="tag-input">
                {resume.skills.map((skill, idx) => (
                  <span className="tag" key={idx}>
                    {skill}
                    <button onClick={() => removeItem("skills", idx)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      e.preventDefault();
                      setResume({ ...resume, skills: [...resume.skills, e.target.value.trim()] });
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </section>
          )}

          {activeSection === "projects" && (
            <section className="builder-section">
              <h2>Projects</h2>
              <p className="section-desc">Showcase key projects that demonstrate your abilities.</p>

              {resume.projects.map((proj, idx) => (
                <div className="entry-card" key={idx}>
                  <div className="entry-card-header">
                    <h4>Project #{idx + 1}</h4>
                    <button className="icon-btn danger" onClick={() => removeItem("projects", idx)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateArrayItem("projects", idx, "name", e.target.value)}
                        placeholder="Project title"
                      />
                    </div>
                    <div className="form-group">
                      <label>Link</label>
                      <input
                        type="url"
                        value={proj.link}
                        onChange={(e) => updateArrayItem("projects", idx, "link", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div className="form-group">
                      <label>Tech Stack</label>
                      <input
                        type="text"
                        value={proj.techStack}
                        onChange={(e) => updateArrayItem("projects", idx, "techStack", e.target.value)}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows="3"
                      value={proj.description}
                      onChange={(e) => updateArrayItem("projects", idx, "description", e.target.value)}
                      placeholder="Describe the project and your role..."
                    />
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline add-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    projects: [...resume.projects, { name: "", description: "", link: "", techStack: "" }],
                  })
                }
              >
                <FaPlus /> Add Project
              </button>
            </section>
          )}

          {activeSection === "certifications" && (
            <section className="builder-section">
              <h2>Certifications</h2>
              <p className="section-desc">Add certifications and licenses that validate your expertise.</p>

              {resume.certifications.map((cert, idx) => (
                <div className="entry-card" key={idx}>
                  <div className="entry-card-header">
                    <h4>Certification #{idx + 1}</h4>
                    <button className="icon-btn danger" onClick={() => removeItem("certifications", idx)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Certification Name</label>
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateArrayItem("certifications", idx, "name", e.target.value)}
                        placeholder="AWS Certified Developer"
                      />
                    </div>
                    <div className="form-group">
                      <label>Issuer</label>
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateArrayItem("certifications", idx, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    <div className="form-group">
                      <label>Year</label>
                      <input
                        type="text"
                        value={cert.year}
                        onChange={(e) => updateArrayItem("certifications", idx, "year", e.target.value)}
                        placeholder="2024"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-outline add-btn"
                onClick={() =>
                  setResume({
                    ...resume,
                    certifications: [...resume.certifications, { name: "", issuer: "", year: "" }],
                  })
                }
              >
                <FaPlus /> Add Certification
              </button>
            </section>
          )}

          {activeSection === "languages" && (
            <section className="builder-section">
              <h2>Languages</h2>
              <p className="section-desc">Add languages you speak and their proficiency.</p>

              <div className="tag-input">
                {resume.languages.map((lang, idx) => (
                  <span className="tag" key={idx}>
                    {lang}
                    <button onClick={() => removeItem("languages", idx)}>
                      <FaTimes />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder="Type a language and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      e.preventDefault();
                      setResume({ ...resume, languages: [...resume.languages, e.target.value.trim()] });
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </section>
          )}
        </main>

        <div className="builder-preview-side">
          <div className="preview-side-header">
            <span className="live-dot"></span>
            Live Preview
          </div>
          <div className="live-preview-frame">
            <div className="live-scale">
              <ResumeSheet resume={resume} compact />
            </div>
          </div>
          <div className="live-preview-label">
            {getTemplate(resume.template).name} template
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="modal-overlay preview-overlay" onClick={() => setShowPreview(false)}>
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Resume Preview</h3>
              <button className="modal-close" onClick={() => setShowPreview(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="preview-body">
              <ResumeSheet resume={resume} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}