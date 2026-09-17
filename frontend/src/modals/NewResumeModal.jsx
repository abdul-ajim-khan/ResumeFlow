import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaFileAlt, FaCheck } from "react-icons/fa";
import { TEMPLATES, getDefaultTemplate } from "../data/templates";

export default function NewResumeModal({ onClose, initialTemplate }) {
  const [title, setTitle] = useState("");
  const [template, setTemplate] = useState(initialTemplate || getDefaultTemplate());
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }
    navigate("/builder/new", { state: { title: title.trim(), template } });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal new-resume-mini-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <FaFileAlt /> New Resume
          </h3>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form className="modal-body" onSubmit={handleCreate}>
          {error && <div className="auth-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="new-resume-title">
              Resume Title <span className="req">*</span>
            </label>
            <input
              id="new-resume-title"
              type="text"
              placeholder="e.g. Frontend Developer Resume"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError("");
              }}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Template</label>
            <div className="template-picker">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`template-chip ${template === t.id ? "active" : ""}`}
                  onClick={() => setTemplate(t.id)}
                  title={t.tagline}
                >
                  {template === t.id && <FaCheck size={10} />}
                  <span className="chip-dot" style={{ background: t.accent }} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <p className="modal-hint new-resume-selected">
            Selected: <strong>{TEMPLATES.find((t) => t.id === template)?.name}</strong>
          </p>
        </form>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleCreate}>
            <FaFileAlt size={14} />
            Create & Continue
          </button>
        </div>
      </div>
    </div>
  );
}