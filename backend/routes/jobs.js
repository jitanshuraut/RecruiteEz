import express from "express";
import { isCandidate, isRecruiter } from "../middlewares/authMiddleware.js";
import {
  Apply_Job,
  Reject_candidate,
  Retrieve_all_candidates,
  Retrieve_candidates_Job,
  addUser,
  create_Job,
  deleteJob,
  fileUpload,
  getAllCandidates_for_hired,
  getCandidates_for_Interview,
  getCandidates_for_selected,
  getRecruiterId,
  get_All_Job,
  get_All_Post,
  get_candidate,
  get_single_Job,
  jobStatus,
  set_Candidate_Status,
  tokenDetails,
  updateJob,
  updateSelectedJob,
} from "../controllers/Jobs.js";
import multer from "multer";
import { viewResume } from "../controllers/viewResume.js";
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post("/mail", sendMail);

router.get("/resume/:userId", viewResume);

// POST - Create a new job
router.post("/", create_Job);

// GET - Retrieve all jobs
router.post("/all", get_All_Job);

router.get("/allPost", get_All_Post);

// GET - Retrieve a single job by ID
router.get("/:jobId", get_single_Job);

// GET - Retrieve all candidates for a job by ID
router.get("/:jobId/candidates", Retrieve_candidates_Job);

// GET - Retrieve all candidates for a job by ID for Interviews
router.get("/:jobId/interviews", Retrieve_all_candidates);

router.get("/candidate/:candidateId", get_candidate);

// GET - Retrieve all candidates for a Interviews
router.get("/interviews/:recruiterId", getCandidates_for_Interview);

// GET - Retrieve all candidates for a hired
router.get("/hired/:recruiterId", getAllCandidates_for_hired);

// GET - Retrieve all candidates for a selected
router.get("/selected/:recruiterId", getCandidates_for_selected);

// PUT - Update a job by ID
router.put("/:jobId", updateJob);

// PUT - update selected array to a job by ID
router.put("/toggle-selected/:jobId", updateSelectedJob);

// DELETE - Delete a job by ID
router.delete("/:jobId", deleteJob);

// Endpoint to add a user to the interviews array
router.put("/:jobId/add-interviewee", addUser);

// Route to set a candidate's status to 'hired' and remove them from interviews
router.put("/:jobId/hire-candidate", set_Candidate_Status);

//to reject a candidate
router.put("/:jobId/reject", Reject_candidate);

//Apply for the job
router.post("/apply", isCandidate, Apply_Job);

router.post("/tokenDetails", tokenDetails);

// Route for file upload
router.post("/upload", upload.single("file"), fileUpload);

// job status
router.put("/:id/status", jobStatus);

// get from recruiterId
router.get("/all/recruiter", getRecruiterId);

export default router;
