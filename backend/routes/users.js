import express from "express";
import {
  createUser,
  deleteUser,
  retrieve,
  retrieveByID,
  update,
  updateCandidate,
  updateRecruiter,
} from "../controllers/User.js";
import multer from "multer";
const router = express.Router();

// import MyResumeSchema from "./../models/ResumePdf";

// POST - Create a new user
router.post("/", createUser);

// GET - Retrieve all users
router.get("/all", retrieve);

// GET - Retrieve a user by ID
router.get("/userInfo/:userId/:role", retrieveByID);

const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });

// PUT - Update a user by ID
router.put("/update/:userId/", update);

// DELETE - Delete a user by ID
router.delete("/:userId", deleteUser);

// profile img
router.get("/profileimg");

// updateCandidate
router.post(
  "/updateCandidate/:userId/",
  upload.single("file"),
  updateCandidate
);

// updateRecruiter
router.post("/updateRecruiter/:userId", updateRecruiter);

export default router;
