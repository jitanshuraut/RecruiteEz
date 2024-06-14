import express from "express";
import {
  createJobTracker,
  deleteJobTracker,
  getJobTracker,
  getJobTrackerRecord,
  updateJobTracker,
} from "../controllers/JobTracker.js";
const router = express.Router();

// POST - Create a new job tracker record for a user
router.post("/", createJobTracker);

// GET - Retrieve all job tracker records
router.get("/all", getJobTracker);

// GET - Retrieve a job tracker record by ID
router.get("/:jobTrackerId", getJobTrackerRecord);

// PUT - Update a job tracker record by ID
router.put("/:jobTrackerId", updateJobTracker);

// DELETE - Delete a job tracker record by ID
router.delete("/:jobTrackerId", deleteJobTracker);

export default router;
