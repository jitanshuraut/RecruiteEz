import express from "express";
import {
  Delete_single_interviewer,
  Get_all_interviews,
  Get_single_interviewer,
  New_interviewer,
  Update_single_interviewer,
} from "../controllers/InterViewer.js";

const router = express.Router();
// POST - Create a new interviewer
router.post("/", New_interviewer);

// GET - Retrieve all interviewers
router.get("/all", Get_all_interviews);

// GET - Retrieve a single interviewer by ID
router.get("/:interviewerId", Get_single_interviewer);

// PUT - Update an interviewer by ID
router.put("/:interviewerId", Update_single_interviewer);

// DELETE - Delete an interviewer by ID
router.delete("/:interviewerId", Delete_single_interviewer);

export default router;
