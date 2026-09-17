import { useState, useContext } from "react";
import {
  FaEye,
  FaFileAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { userAPI } from "../services/api";
import AuthContext from "../context/AuthContext";
import TemplatePreviewModal from "../modals/TemplatePreviewModal";
import TemplateThumb from "../components/TemplateThumb";
import {
  TEMPLATES,
  getTemplate,
  getDefaultTemplate,
  saveDefaultTemplate,
} from "../data/templates";

export default function TemplatesTab({ onUseTemplate }) {
  const { token } = useContext(AuthContext);
  const [preview, setPreview] = useState(null);
  const [defaultTpl, setDefaultTpl] = useState(getDefaultTemplate);

  const setDefault = async (tplId) => {
    const tpl = getTemplate(tplId);
    saveDefaultTemplate(tpl.id);
    setDefaultTpl(tpl.id);
    if (token) {
      try {
        await userAPI.updateProfile({ defaultTemplate: tpl.id });
      } catch (err) {
        // keep local default even if sync fails
      }
    }
  };

  const handleUse = (template) => {
    if (!token) return;
    setDefault(template.id);
    if (onUseTemplate) {
      onUseTemplate(template);
    }
  };

  const currentDefault = getTemplate(defaultTpl);

  return (
    <div className="templates-tab">
      <div className="templates-header">
        <div>
          <h2 className="tab-heading">Choose Your Template</h2>
          <p className="tab-subheading">
            Every template renders a different professional format. The one you
            pick becomes your default for new resumes.
          </p>
        </div>
        <div className="default-banner">
          <FaCheckCircle style={{ color: "#10b981" }} />
          <span>
            Current default: <strong>{currentDefault.name}</strong>
          </span>
        </div>
      </div>

      <div className="template-grid">
        {TEMPLATES.map((tpl) => {
          const isDefault = defaultTpl === tpl.id;
          return (
            <div className="template-card" key={tpl.id}>
              <div className="template-preview">
                <div
                  className="tpl-pick"
                  onClick={() => {
                    setDefault(tpl.id);
                    setPreview(tpl);
                  }}
                >
                  <TemplateThumb templateId={tpl.id} />
                  <div className="tpl-pick-overlay">
                    <FaEye /> Preview
                  </div>
                </div>
                {isDefault && (
                  <div className="default-badge">
                    <FaCheckCircle /> Default
                  </div>
                )}
              </div>

              <div className="template-info">
                <div className="template-info-head">
                  <h3>{tpl.name}</h3>
                </div>

                <div className="template-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUse(tpl)}
                  >
                    <FaFileAlt size={12} />
                    Use Template
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
          onUse={() => handleUse(preview)}
          onDefaultChange={(id) => setDefault(id)}
          isTemplate
        />
      )}
    </div>
  );
}