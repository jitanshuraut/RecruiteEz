import { Recruiter } from "../models/candidateModel.js";

// POST - Create a new interviewer
export const New_interviewer = async (req, res) => {
  try {
    const interviewer = new Recruiter(req.body);
    await interviewer.save();
    res.status(201).send(interviewer);
  } catch (error) {
    res.status(400).json({ message: "Error occur in adding user" });;
  }
};

// GET - Retrieve all interviewers
export const Get_all_interviews = async (req, res) => {
  try {
    const interviewers = await Recruiter.find({});
    res.send(interviewers);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting all user" });;
  }
};

// GET - Retrieve a single interviewer by ID
export const Get_single_interviewer = async (req, res) => {
  try {
    const interviewer = await Recruiter.findById(req.params.interviewerId);
    if (!interviewer) {
      return res.status(404).send();
    }
    res.send(interviewer);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting user" });
  }
};

// PUT - Update an interviewer by ID
export const Update_single_interviewer = async (req, res) => {
  try {
    const interviewer = await Recruiter.findByIdAndUpdate(
      req.params.interviewerId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interviewer) {
      return res.status(404).send();
    }
    res.send(interviewer);
  } catch (error) {
    res.status(400).json({ message: "Error occur in updateing user" });
  }
};

// DELETE - Delete an interviewer by ID
export const Delete_single_interviewer = async (req, res) => {
  try {
    const interviewer = await Recruiter.findByIdAndDelete(
      req.params.interviewerId
    );
    if (!interviewer) {
      return res.status(404).send();
    }
    res.send(interviewer);
  } catch (error) {
    res.status(500).json({ message: "Error occur in deleting user" });
  }
};
