import express from "express";
import {
  delete_resume_by_Id,
  get_file,
  get_resume_by_Id,
  get_resumes,
  submit_resume,
  update_resume_by_Id,
  upload_file,
} from "../controllers/Resumes.js";
const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });
// POST - Submit a new resume
router.post("/", submit_resume);

// GET - Retrieve all submitted resumes

router.get("/all", get_resumes);

// GET - Retrieve a specific resume by ID
router.get("/:resumeId", get_resume_by_Id);

// PUT - Update a submitted resume by ID
router.put("/:resumeId", update_resume_by_Id);

// DELETE - Delete a submitted resume by ID
router.delete("/:resumeId", delete_resume_by_Id);

router.get("/get-files", get_file);

router.post("/upload", upload.single("file"), upload_file);

export default router;
