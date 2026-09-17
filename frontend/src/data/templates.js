export const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    tagline: "Clean two-column layout with skill bars",
    description: "Clean layout with skill bars and accent color",
    accent: "#6366f1",
    dark: "#4f46e5",
    soft: "#eef2ff",
    features: ["Two-column layout", "Skill accent bars", "Simple & clean"],
  },
  {
    id: "classic",
    name: "Classic",
    tagline: "Timeless single-column serif format",
    description: "Timeless professional design for any industry",
    accent: "#0f172a",
    dark: "#0f172a",
    soft: "#f1f5f9",
    features: ["Single column", "Serif headings", "Conservative style"],
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Simple, clean and ATS friendly",
    description: "Simple and elegant with maximum white space",
    accent: "#10b981",
    dark: "#059669",
    soft: "#ecfdf5",
    features: ["Clean typography", "Lightweight", "ATS friendly"],
  },
  {
    id: "creative",
    name: "Creative",
    tagline: "Bold sidebar design for modern roles",
    description: "Bold colors and sidebar for design roles",
    accent: "#f59e0b",
    dark: "#d97706",
    soft: "#fffbeb",
    features: ["Left sidebar", "Bold accent", "Modern feel"],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Executive layout with clear hierarchy",
    description: "Executive-grade layout with refined details",
    accent: "#0ea5e9",
    dark: "#0284c7",
    soft: "#f0f9ff",
    features: ["Formal structure", "Clear hierarchy", "Executive style"],
  },
  {
    id: "elegant",
    name: "Elegant",
    tagline: "Sophisticated centered serif design",
    description: "Sophisticated design with subtle styling",
    accent: "#8b5cf6",
    dark: "#7c3aed",
    soft: "#f5f3ff",
    features: ["Soft accents", "Elegant spacing", "Premium look"],
  },
];

export const DEFAULT_TEMPLATE_ID = "modern";

export const getTemplate = (id) =>
  TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

export function getDefaultTemplate() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.defaultTemplate && TEMPLATES.some((t) => t.id === user.defaultTemplate)) {
      return user.defaultTemplate;
    }
  } catch (e) {
    // ignore
  }
  const stored = localStorage.getItem("defaultTemplate");
  if (stored && TEMPLATES.some((t) => t.id === stored)) {
    return stored;
  }
  return DEFAULT_TEMPLATE_ID;
}

export function saveDefaultTemplate(id) {
  const tpl = getTemplate(id);
  localStorage.setItem("defaultTemplate", tpl.id);
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      user.defaultTemplate = tpl.id;
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (e) {
    // ignore
  }
}