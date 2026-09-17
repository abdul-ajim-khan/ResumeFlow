import { useState } from "react";
import {
  FaTimes,
  FaEdit,
  FaFileAlt,
  FaEye,
  FaSpinner,
  FaDownload,
} from "react-icons/fa";
import { resumeAPI } from "../services/api";
import { demoResume } from "../data/demoData";
import { getTemplate } from "../data/templates";
import ResumeSheet from "../components/ResumeSheet";
import { downloadResumePDF } from "../utils/download";

export default function TemplatePreviewModal({
  resume,
  template,
  onClose,
  onEdit,
  onUse,
  onDefaultChange,
  isTemplate,
}) {
  const [creating, setCreating] = useState(false);

  const data = isTemplate
    ? { ...demoResume, title: template?.name || "Resume", template: template?.id || "modern" }
    : resume || {
        title: "Resume",
        template: template?.id || "modern",
        personal: {},
        experience: [],
        education: [],
        skills: [],
        languages: [],
        certifications: [],
        projects: [],
      };

  const handleUse = async () => {
    if (isTemplate) {
      if (onDefaultChange) await onDefaultChange(data.template);
      if (onUse) {
        onUse();
      } else {
        onClose();
      }
      return;
    }
    setCreating(true);
    try {
      const tpl = getTemplate(data.template || "modern");
      if (onDefaultChange) await onDefaultChange(data.template || tpl.id);
      const res = await resumeAPI.create({
        title: `${tpl.name} Resume`,
        template: tpl.id,
      });
      onClose();
      if (onEdit) onEdit(res.data.resume._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create resume");
      setCreating(false);
    }
  };

  const heading = isTemplate
    ? `${template?.name || "Template"} Demo Preview`
    : "Resume Preview";

  return (
    <div className="modal-overlay preview-overlay" onClick={onClose}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <div className="preview-title-wrap">
            <h3>
              <FaEye /> {heading}
            </h3>
            {isTemplate ? (
              <p className="preview-subtitle">
                This is exactly how your resume will look with the{" "}
                <strong>{template?.name}</strong> template.
              </p>
            ) : (
              data.title && <p className="preview-subtitle">{data.title}</p>
            )}
          </div>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="preview-body">
          <ResumeSheet resume={data} />
        </div>

        <div className="preview-footer">
          {isTemplate ? (
            <button
              className="btn btn-primary"
              onClick={handleUse}
              disabled={creating}
            >
              {creating ? (
                <FaSpinner className="spin" />
              ) : (
                <FaFileAlt size={14} />
              )}
              Use This Template
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary"
                onClick={() => downloadResumePDF(data)}
              >
                <FaDownload /> Download PDF
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  onClose();
                  onEdit && onEdit();
                }}
              >
                <FaEdit /> Edit Resume
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}