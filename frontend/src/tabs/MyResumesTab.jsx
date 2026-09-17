import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaFileAlt,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaCopy,
  FaEye,
} from "react-icons/fa";
import { resumeAPI } from "../services/api";
import NewResumeModal from "../modals/NewResumeModal";
import TemplatePreviewModal from "../modals/TemplatePreviewModal";
import ResumeSheet from "../components/ResumeSheet";
import { getTemplate } from "../data/templates";

export default function MyResumesTab({ onNewResume }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNewModal, setShowNewModal] = useState(false);
  const [previewResume, setPreviewResume] = useState(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const res = await resumeAPI.getAll();
      setResumes(res.data.resumes);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this resume? This cannot be undone.",
      )
    )
      return;
    try {
      await resumeAPI.remove(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete resume");
    }
  };

  const navigate = useNavigate();

  const handleEdit = (id) => {
    navigate(`/builder/${id}`);
  };

  const handleDuplicate = async (r) => {
    try {
      const {
        title,
        template,
        personal,
        experience,
        education,
        skills,
        languages,
        certifications,
        projects,
      } = r;
      await resumeAPI.create({
        title: `${title} (Copy)`,
        template,
        personal,
        experience,
        education,
        skills,
        languages,
        certifications,
        projects,
      });
      loadResumes();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to duplicate resume");
    }
  };

  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="my-resumes">
          <div className="btn-plc">      <button className="topbar-create "
              onClick={() => setShowNewModal(true)}
                >
            <FaPlus />
            <span>New Resume</span>
          </button>
          </div>
      {/* <div className="section-actions">
        <button
          className="new-resume-btn"
          onClick={() => setShowNewModal(true)}
        >
          <div className="plus-circle">
            <FaPlus />
          </div>

          <span>New Resume</span>
        </button>
      </div> */}

      {loading && (
        <div className="loading-state">
          <FaSpinner className="spin" size={32} />
          <p>Loading your resumes...</p>
        </div>
      )}

      {error && <div className="error-state">{error}</div>}

      {!loading && !error && resumes.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">
            <FaFileAlt size={44} />
          </div>
          <h3>No resumes yet</h3>
          <button
            className="btn btn-primary"
            onClick={() => setShowNewModal(true)}
          >
            <FaPlus /> Create Your First Resume
          </button>
        </div>
      )}

      {!loading && resumes.length > 0 && (
        <div className="resume-grid">
          {resumes.map((r) => (
            <div className="resume-card" key={r._id}>
              <div
                className="resume-card-thumb"
                onClick={() => setPreviewResume(r)}
              >
                <span
                  className="thumb-template-bar"
                  style={{ background: getTemplate(r.template).accent }}
                />
                <div className="thumb-scale">
                  <ResumeSheet resume={r} compact />
                </div>
                <span className="thumb-template-name">
                  {getTemplate(r.template).name} template
                </span>
              </div>

              <div className="resume-card-info">
                <h3>{r.title}</h3>
                <p>Updated {formatDate(r.updatedAt)}</p>
              </div>

              <div className="resume-card-actions">
                <button
                  className="icon-btn"
                  title="Edit"
                  onClick={() => handleEdit(r._id)}
                >
                  <FaEdit />
                </button>
                <button
                  className="icon-btn"
                  title="Preview"
                  onClick={() => setPreviewResume(r)}
                >
                  <FaEye />
                </button>
                <button
                  className="icon-btn"
                  title="Duplicate"
                  onClick={() => handleDuplicate(r)}
                >
                  <FaCopy />
                </button>
                <button
                  className="icon-btn danger"
                  title="Delete"
                  onClick={() => handleDelete(r._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          <div className="section-actions">
            <button
              className="new-resume-btn"
              onClick={() => setShowNewModal(true)}
            >
              <div className="plus-circle">
                <FaPlus />
              </div>
              <span>New Resume</span>
            </button>
          </div>
        </div>
      )}

      {showNewModal && (
        <NewResumeModal onClose={() => setShowNewModal(false)} />
      )}
      {previewResume && (
        <TemplatePreviewModal
          resume={previewResume}
          onClose={() => setPreviewResume(null)}
          onEdit={() => handleEdit(previewResume._id)}
        />
      )}
    </div>
  );
}
