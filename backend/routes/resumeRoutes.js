const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require("../controllers/resumeController");

router.use(protect);

router.get("/", getResumes);
router.get("/:id", getResumeById);
router.post("/", createResume);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router;
