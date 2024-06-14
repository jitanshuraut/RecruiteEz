import { ResumesATS } from "../models/jobSchema.js";

// POST - Create a new resume
export const createResume = async (req, res) => {
  try {
    const resume = new ResumesATS(req.body);
    await resume.save();
    res.status(201).send(resume);
  } catch (error) {
    res.status(400).send(error);
  }
};

// GET - Retrieve all resumes
export const getResume = async (req, res) => {
  try {
    const resumes = await ResumesATS.find({});
    res.send(resumes);
  } catch (error) {
    res.status(500).send(error);
  }
};

// GET - Retrieve a single resume by ID
export const getResumeById = async (req, res) => {
  try {
    const resume = await ResumesATS.findById(req.params.resumeId);
    if (!resume) {
      return res.status(404).send();
    }
    res.send(resume);
  } catch (error) {
    res.status(500).send(error);
  }
};

// PUT - Update a resume by ID
export const updateResumeById = async (req, res) => {
  try {
    const resume = await ResumesATS.findByIdAndUpdate(
      req.params.resumeId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!resume) {
      return res.status(404).send();
    }
    res.send(resume);
  } catch (error) {
    res.status(400).send(error);
  }
};

// DELETE - Delete a resume by ID
export const deleteResumeById = async (req, res) => {
  try {
    const resume = await ResumesATS.findByIdAndDelete(req.params.resumeId);
    if (!resume) {
      return res.status(404).send();
    }
    res.send(resume);
  } catch (error) {
    res.status(500).send(error);
  }
};
