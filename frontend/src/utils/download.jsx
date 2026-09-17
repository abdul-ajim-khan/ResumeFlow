import { renderToString } from "react-dom/server";
import ResumeSheet from "../components/ResumeSheet";

export function downloadResumePDF(resume) {
  const title = (resume.title || "Resume").replace(/[^a-zA-Z0-9 ]/g, "");
  const sheetHtml = renderToString(<ResumeSheet resume={resume} />);

  let css = "";
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          css += rule.cssText + "\n";
        }
      } catch {}
    }
  } catch {}

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: "Segoe UI", system-ui, -apple-system, sans-serif; background: #fff; }
  @media print {
    body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    .resume-sheet { box-shadow: none !important; margin: 0 !important; max-width: none !important; }
  }
  ${css}
</style>
</head>
<body>
${sheetHtml}
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:none;";
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }, 500);
  };
}
