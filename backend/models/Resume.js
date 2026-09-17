const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    template: {
      type: String,
      default: "modern",
    },
    personal: {
      fullName: { type: String, default: "" },
      jobTitle: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      summary: { type: String, default: "" },
      photo: { type: String, default: "" },
    },
    experience: [
      {
        company: { type: String, default: "" },
        position: { type: String, default: "" },
        location: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        current: { type: Boolean, default: false },
        description: { type: String, default: "" },
      },
    ],
    education: [
      {
        school: { type: String, default: "" },
        degree: { type: String, default: "" },
        fieldOfStudy: { type: String, default: "" },
        startDate: { type: String, default: "" },
        endDate: { type: String, default: "" },
        description: { type: String, default: "" },
      },
    ],
    skills: [String],
    languages: [String],
    certifications: [
      {
        name: { type: String, default: "" },
        issuer: { type: String, default: "" },
        year: { type: String, default: "" },
      },
    ],
    projects: [
      {
        name: { type: String, default: "" },
        description: { type: String, default: "" },
        link: { type: String, default: "" },
        techStack: { type: String, default: "" },
      },
    ],
    sectionOrder: {
      type: [String],
      default: ["personal", "experience", "education", "skills", "projects", "certifications", "languages"],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", resumeSchema);
