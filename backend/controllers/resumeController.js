const Resume = require("../models/Resume");

const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.userId }).sort({
      updatedAt: -1,
    });
    res.status(200).json({
      success: true,
      resumes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createResume = async (req, res) => {
  try {
    const { title, template, personal, experience, education, skills, languages, certifications, projects, sectionOrder } = req.body;

    const resume = await Resume.create({
      user: req.user.userId,
      title: title || "Untitled Resume",
      template: template || "modern",
      ...(personal && { personal }),
      ...(experience && { experience }),
      ...(education && { education }),
      ...(skills && { skills }),
      ...(languages && { languages }),
      ...(certifications && { certifications }),
      ...(projects && { projects }),
      ...(sectionOrder && { sectionOrder }),
    });

    res.status(201).json({
      success: true,
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const { title, template, personal, experience, education, skills, languages, certifications, projects, sectionOrder } = req.body;

    if (title !== undefined) resume.title = title;
    if (template !== undefined) resume.template = template;
    if (personal !== undefined) resume.personal = personal;
    if (experience !== undefined) resume.experience = experience;
    if (education !== undefined) resume.education = education;
    if (skills !== undefined) resume.skills = skills;
    if (languages !== undefined) resume.languages = languages;
    if (certifications !== undefined) resume.certifications = certifications;
    if (projects !== undefined) resume.projects = projects;
    if (sectionOrder !== undefined) resume.sectionOrder = sectionOrder;

    await resume.save();

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
