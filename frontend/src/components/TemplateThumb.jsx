import { demoResume } from "../data/demoData";
import { getTemplate } from "../data/templates";
import ResumeSheet from "./ResumeSheet";

export default function TemplateThumb({ templateId, className }) {
  const tpl = getTemplate(templateId);
  return (
    <div className={`tt ${className || ""}`} style={{ "--accent": tpl.accent }}>
      <div className="tt-accent" />
      <div className="tt-scale">
        <ResumeSheet resume={{ ...demoResume, template: tpl.id }} compact />
      </div>
    </div>
  );
}