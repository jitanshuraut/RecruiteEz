import nodemailer from "nodemailer";
import { Recruiter } from "../models/candidateModel.js";
import { Candidate } from "../models/candidateModel.js";
import MyResumeSchema from "../models/ResumePdf.js";

export const viewResume = async (req, res) => {
  try {
    // Find the file in MongoDB based on its filename

    console.log("Hi from viewResume");
    console.log(req.params.userId);
    const file = await MyResumeSchema.findOne({ userId: req.params.userId });
    if (!file) {
      return res.status(404).send("File not found");
    }

    // Send the PDF data as a response
    res.set("Content-Type", "application/pdf");
    res.send(file.data);
  } catch (error) {
    console.error("Error fetching PDF:", error);
    res.status(500).send("Internal Server Error");
  }

  console.log("resume view");
};
