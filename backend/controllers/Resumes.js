import { Resumes } from "../models/jobSchema.js";
import { ResumeFile } from "../models/jobSchema.js";

// POST - Submit a new resume
export const submit_resume = async (req, res) => {
  try {
    const resume = new Resumes({
      ...req.body,
      submittedOn: new Date(), // Automatically set the submission date
    });
    await resume.save();
    res.status(201).send(resume);
  } catch (error) {
    res.status(400).json({ message: "Error occur in submiting file" });
  }
};

// GET - Retrieve all submitted resumes
export const get_resumes = async (req, res) => {
  try {
    const resumes = await Resumes.find({});
    res.send(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting file" });
  }
};

// GET - Retrieve a specific resume by ID

export const get_resume_by_Id = async (req, res) => {
  try {
    const resume = await Resumes.findById(req.params.resumeId);
    if (!resume) {
      return res.status(404).send();
    }
    res.send(resume);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting file" });
  }
};
// PUT - Update a submitted resume by ID

export const update_resume_by_Id = async (req, res) => {
  try {
    const resume = await Resumes.findByIdAndUpdate(
      req.params.resumeId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) {
      return res.status(404).send();
    }
    res.send(resume);
  } catch (error) {
    res.status(400).json({ message: "Error occur in updaeting file" });
  }
};

// DELETE - Delete a submitted resume by ID
export const delete_resume_by_Id = async (req, res) => {
  try {
    const resume = await Resumes.findByIdAndDelete(req.params.resumeId);
    if (!resume) {
      return res.status(404).send();
    }
    res.send({ message: "Resume successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error occur in deleting file" });
  }
};

export const get_file = async (req, res) => {
  try {
    ResumeFile.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.json({ message: "Error occur in getting file" });
  }
};

// upload file

export const upload_file = async (req, res) => {
  console.log(req.file);
  const fileName = req.file;
  try {
    const data = await ResumeFile.create({ pdf: fileName });
    res.send({ status: data });
  } catch (error) {
    res.json({ message: "Error occur in uploading" });
  }
};
