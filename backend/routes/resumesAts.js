import express from "express";
import {
  createResume,
  deleteResumeById,
  getResume,
  getResumeById,
  updateResumeById,
} from "../controllers/ResumeATS.js";
const router = express.Router();

// POST - Create a new resume
router.post("/", createResume);

// GET - Retrieve all resumes
router.get("/all", getResume);

// GET - Retrieve a single resume by ID
router.get("/:resumeId", getResumeById);

// PUT - Update a resume by ID
router.put("/:resumeId", updateResumeById);

// DELETE - Delete a resume by ID
router.delete("/:resumeId", deleteResumeById);

export default router;
