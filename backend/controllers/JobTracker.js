import { JobTracker } from "../models/jobSchema.js";

// POST - Create a new job tracker record for a user
export const createJobTracker = async (req, res) => {
  try {
    const jobTracker = new JobTracker(req.body);
    await jobTracker.save();
    res.status(201).send(jobTracker);
  } catch (error) {
    res.status(400).send(error);
  }
};

// GET - Retrieve all job tracker records
export const getJobTracker = async (req, res) => {
  try {
    const jobTrackers = await JobTracker.find({});
    res.send(jobTrackers);
  } catch (error) {
    res.status(500).send(error);
  }
};

// GET - Retrieve a job tracker record by ID
export const getJobTrackerRecord = async (req, res) => {
  try {
    const jobTracker = await JobTracker.findById(req.params.jobTrackerId);
    if (!jobTracker) {
      return res.status(404).send();
    }
    res.send(jobTracker);
  } catch (error) {
    res.status(500).send(error);
  }
};

// PUT - Update a job tracker record by ID
export const updateJobTracker = async (req, res) => {
  try {
    const jobTracker = await JobTracker.findByIdAndUpdate(
      req.params.jobTrackerId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!jobTracker) {
      return res.status(404).send();
    }
    res.send(jobTracker);
  } catch (error) {
    res.status(400).send(error);
  }
};

// DELETE - Delete a job tracker record by ID
export const deleteJobTracker = async (req, res) => {
  try {
    const jobTracker = await JobTracker.findByIdAndDelete(
      req.params.jobTrackerId
    );
    if (!jobTracker) {
      return res.status(404).send();
    }
    res.send(jobTracker);
  } catch (error) {
    res.status(500).send(error);
  }
};
