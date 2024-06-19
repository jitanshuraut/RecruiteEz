import { Job } from "../models/jobSchema.js";
import { Candidate, Recruiter } from "../models/candidateModel.js";
import { ResumeFile } from "../models/jobSchema.js";
import JWT from "jsonwebtoken";
import MyResumeSchema from "../models/ResumePdf.js";
import axios from "axios";
import { sendMail } from "./sendMail.js";

// POST - Create a new job
export const create_Job = async (req, res) => {
  try {
    const recruiterId = req.body.recruiterId;
    if (!recruiterId) {
      return res.status(400).send({ error: "Recruiter ID is required" });
    }

    const recruiter = await Recruiter.findById(recruiterId);
    if (!recruiter) {
      return res.status(404).send({ error: "Recruiter not found" });
    }

    const job = new Job({
      title: req.body.title,
      requirements: req.body.requirements,
      location: req.body.location,
      salaryRange: req.body.salaryRange,
      description: req.body.description,
      seats: req.body.seats,
      createdBy: recruiterId,
      company: recruiter.company,
      active: true,
      status: "none",
    });

    await job.save();
    res.status(201).send(job);
  } catch (error) {
    console.error("Failed to create job:", error);
    res.status(400).json({ message: "Error occur in creating job" });
  }
};

// GET - Retrieve all jobs
export const get_All_Job = async (req, res) => {
  const { userId } = req.body;
  try {
    console.log(userId);
    const jobs = await Job.find({
      candidates: {
        $elemMatch: { candidateId: userId },
      },
    });
    res.send(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting all jobs" });
  }
};

export const get_All_Post = async (req, res) => {
  try {
    const jobs = await Job.find({});
    res.send(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting all posts" });
  }
};

// GET endpoint to fetch jobs by recruiter ID
//export const jobs_= async (req, res) => {
//   try {
//     const recruiterId = req.query.recruiterId;
//     if (!recruiterId) {
//       return res.status(400).send({ error: "Recruiter ID is required" });
//     }

//     // Find all jobs where 'createdBy' matches the provided recruiter ID
//     const jobs = await Job.find({ createdBy: recruiterId });

//     // Respond with the found jobs
//     res.status(200).send(jobs);
//   } catch (error) {
//     // Log the error and respond with a 500 status code for server error
//     console.error("Failed to fetch jobs:", error);
//     res.status(500).send({ error: error.message });
//   }
// };

// GET - Retrieve a single job by ID
export const get_single_Job = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).send();
    }
    res.send(job);
  } catch (error) {
    res.status(500).json({ message: "Error occur in getting single jobs" });
  }
};

// GET - Retrieve all candidates for a job by ID
export const Retrieve_candidates_Job = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    // Extract candidateIds from the job's candidates array
    const candidateIds = job.candidates.map((c) => c.candidateId);

    // Find candidates with those IDs
    const candidates = await Candidate.find({ _id: { $in: candidateIds } });

    res.send(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error occur in Retrieve candidates" });
  }
};

// GET - Retrieve all candidates for a job by ID for Interviews

export const Retrieve_all_candidates = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    const candidateIds = job.interviews.map(
      (interview) => interview.candidateId
    );

    const candidates = await Candidate.find({ _id: { $in: candidateIds } });

    const candidatesWithInterviewDetails = candidates.map((candidate) => {
      const interviewDetails = job.interviews.find(
        (interview) => interview.candidateId === candidate._id.toString()
      );
      return {
        ...candidate.toObject(),
        interviewDate: interviewDetails.interviewDate,
      };
    });
    console.log("interver candidate:----------------------------------------");
    console.log(candidatesWithInterviewDetails);

    res.json(candidatesWithInterviewDetails);
  } catch (error) {
    res.status(500).json({ message: "Error occur in Retrieve all candidates" });
  }
};

export const get_candidate = async (req, res) => {
  const candidateId = req.params.candidateId;

  if (!candidateId) {
    return res.status(400).send({ error: "Candidate ID is required" });
  }

  try {
    const candidate = await Candidate.findById(candidateId).select(
      "name email"
    );
    if (!candidate) {
      return res.status(404).send({ error: "Candidate not found" });
    }
    res.status(200).send(candidate);
  } catch (error) {
    console.error("Failed to fetch candidate:", error);
    res.status(500).json({ message: "Error occur in candidate" });
  }
};

// GET - Retrieve all candidates for a Interviews
export const getCandidates_for_Interview = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  if (!recruiterId) {
    return res.status(400).send({ error: "Recruiter ID is required" });
  }

  console.log("Recruiter ID:", recruiterId);
  try {
    // Assuming Job model is correctly linked with the Candidate model
    const jobs = await Job.find({ createdBy: recruiterId });

    console.log("Jobs found:", jobs.length);
    console.log(jobs);
    // Debugging output
    // const interviews = jobs.interviews.map((interview) => ({
    //   candidateId: interview.candidateId,
    //   date: interview.interviewDate,
    // }));

    // console.log("Interview Details:");
    // interviews.forEach((interview) => {
    //   console.log(`Candidate ID: ${interview.candidateId}`);
    //   console.log(`Date: ${interview.date}`);
    //   console.log("------------------------");
    // });

    const candidatesForInterview = jobs.reduce((acc, job) => {
      const interviewCandidates = job.candidates.filter(
        (candidate) => candidate.status === "Interview"
      );
      interviewCandidates.forEach((candidate) => {
        const candidateDetails = candidate.candidateId; // This now contains candidate details populated from the database
        acc.push({
          jobId: job._id,
          jobTitle: job.title,
          candidateId: candidate.candidateId,
          candidateName: candidateDetails.name, // Added candidate name
          candidateEmail: candidateDetails.email, // Added candidate email
          applyDate: candidate.applyDate,
          interviewDate: job.interviews.find(
            (interview) => interview.candidateId === candidate.candidateId
          )?.interviewDate,
        });
      });
      return acc;
    }, []);

    res.status(200).send(candidatesForInterview);
  } catch (error) {
    console.error("Failed to fetch candidate interviews:", error);
    res.status(500).json({ message: "Failed to fetch candidate interviews" });
  }
};

// GET - Retrieve all candidates for a hired
export const getAllCandidates_for_hired = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  if (!recruiterId) {
    return res.status(400).send({ error: "Recruiter ID is required" });
  }

  console.log("Recruiter ID:", recruiterId);
  try {
    // Assuming Job model is correctly linked with the Candidate model
    const jobs = await Job.find({ createdBy: recruiterId }).populate({
      path: "candidates.candidateId",
      select: "name email", // Only fetch name and email from the Candidate document
    });

    console.log("Jobs found:", jobs.length); // Debugging output

    const candidatesForInterview = jobs.reduce((acc, job) => {
      const interviewCandidates = job.candidates.filter(
        (candidate) => candidate.status === "Hired"
      );
      interviewCandidates.forEach((candidate) => {
        const candidateDetails = candidate.candidateId; // This now contains candidate details populated from the database
        acc.push({
          jobId: job._id,
          jobTitle: job.title,
          candidateId: candidate.candidateId,
          candidateName: candidateDetails.name, // Added candidate name
          candidateEmail: candidateDetails.email, // Added candidate email
          applyDate: candidate.applyDate,
        });
      });
      return acc;
    }, []);

    console.log(candidatesForInterview);

    res.status(200).send(candidatesForInterview);
  } catch (error) {
    console.error("Failed to fetch candidate interviews:", error);
    res.status(500).json({ message: "Failed to fetch candidate interviews" });
  }
};

// GET - Retrieve all candidates for a selected
export const getCandidates_for_selected = async (req, res) => {
  const recruiterId = req.params.recruiterId;

  if (!recruiterId) {
    return res.status(400).send({ error: "Recruiter ID is required" });
  }

  console.log("Recruiter ID:", recruiterId);
  try {
    // Assuming Job model is correctly linked with the Candidate model
    const jobs = await Job.find({ createdBy: recruiterId }).populate({
      path: "candidates.candidateId",
      select: "name email", // Only fetch name and email from the Candidate document
    });

    console.log("Jobs found:", jobs.length); // Debugging output

    const candidatesForInterview = jobs.reduce((acc, job) => {
      const interviewCandidates = job.candidates.filter(
        (candidate) => candidate.status === "Selected"
      );
      interviewCandidates.forEach((candidate) => {
        const candidateDetails = candidate.candidateId; // This now contains candidate details populated from the database
        acc.push({
          jobId: job._id,
          jobTitle: job.title,
          candidateId: candidate.candidateId,
          candidateName: candidateDetails.name, // Added candidate name
          candidateEmail: candidateDetails.email, // Added candidate email
          applyDate: candidate.applyDate,
        });
      });
      return acc;
    }, []);

    res.status(200).send(candidatesForInterview);
  } catch (error) {
    console.error("Failed to fetch candidate interviews:", error);
    res.status(500).json({ message: "Failed to fetch candidate interviews" });
  }
};

// PUT - Update a job by ID
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).send();
    }
    res.send(job);
  } catch (error) {
    res.status(400).json({ message: "Error occur in updateing job" });
  }
};

// PUT - update selected array to a job by ID
export const updateSelectedJob = async (req, res) => {
  const { index } = req.body; // Index of the candidate in the candidates array
  const { jobId } = req.params;
  console.log(index);

  try {
    // Fetch the current job to access the candidates array
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Check the current status and toggle it accordingly
    const currentStatus = job.candidates[index].status;
    const newStatus = currentStatus == "Selected" ? "Applied" : "Selected";

    // Update the status of the specific candidate
    const result = await Job.updateOne(
      {
        _id: jobId,
        [`candidates.${index}.candidateId`]: job.candidates[index].candidateId,
      },
      { $set: { [`candidates.${index}.status`]: newStatus } }
    );

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error occur in update job " });
  }
};

// DELETE - Delete a job by ID
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      return res.status(404).send();
    }
    res.send({ message: "Job successfully deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error occur in deleting  job" });
  }
};

// Endpoint to add a user to the interviews array
export const addUser = async (req, res) => {
  console.log("Received data for job:", req.body);
  const { index, userId, interviewDate, recruiterId } = req.body;
  const { jobId } = req.params;

  try {
    // Find the job document first to ensure it exists and to facilitate complex updates
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send("Job not found");
    }

    // Update or add the interview
    let interviewExists = job.interviews.some(
      (interview) => interview.candidateId === userId
    );
    if (interviewExists) {
      // Update existing interview date
      job.interviews = job.interviews.map((interview) =>
        interview.candidateId === userId
          ? { ...interview, interviewDate: interviewDate }
          : interview
      );
    } else {
      // Add a new interview
      job.interviews.push({
        candidateId: userId,
        interviewDate: interviewDate,
      });
    }

    // Update candidate status to 'interview'
    console.log(index);
    console.log(job.candidates.length);
    console.log(job.candidates[index].candidateId);
    console.log(userId);

    if (
      index >= 0 &&
      index < job.candidates.length &&
      job.candidates[index].candidateId === userId
    ) {
      job.candidates[index].status = "Interview";
    } else {
      return res
        .status(400)
        .send("Candidate index is out of bounds or candidate ID mismatch");
    }

    // Save the updated job document
    await job.save();

    let mail_response = await sendMail(recruiterId, userId, interviewDate);
    console.log(mail_response);

    res.json({
      success: true,
      message: interviewExists
        ? "Interviewee updated successfully"
        : "New interviewee added successfully",
      job,
    });
  } catch (error) {
    console.error("Error adding/updating interviewee:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Route to set a candidate's status to 'hired' and remove them from interviews
export const set_Candidate_Status = async (req, res) => {
  const { jobId } = req.params;
  const { candidateId } = req.body;

  try {
    // Find the job with the given jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ error: "Job not found" });
    }

    // Find the candidate in the candidates array
    const candidateIndex = job.candidates.findIndex(
      (cand) => cand.candidateId === candidateId
    );
    if (candidateIndex === -1) {
      return res
        .status(400)
        .send({ error: "Candidate not found in job candidates" });
    }

    // Remove the candidate from the interviews array
    job.interviews = job.interviews.filter(
      (interview) => interview.candidateId !== candidateId
    );

    job.candidates[candidateIndex].status = "Hired";
    job.hired.push(candidateId);

    await job.save();

    res.send({
      message: "Candidate has been hired and removed from interviews.",
    });
  } catch (error) {
    console.error("Error hiring candidate:", error);
    res
      .status(500)
      .send({ error: "Failed to update job for hiring candidate" });
  }
};

//to reject a candidate
export const Reject_candidate = async (req, res) => {
  const { userId } = req.body;
  const { jobId } = req.params;

  try {
    // Use $addToSet to avoid adding duplicates
    const job = await Job.findByIdAndUpdate(jobId);

    if (!job) {
      return res.status(404).send("Job not found");
    }

    const candidateIndex = job.candidates.findIndex(
      (cand) => cand.candidateId === userId
    );
    if (candidateIndex === -1) {
      return res
        .status(400)
        .send({ error: "Candidate not found in job candidates" });
    }

    // Remove the candidate from the interviews array
    job.interviews = job.interviews.filter(
      (interview) => interview.candidateId !== userId
    );

    // Update the status of the candidate to 'rejected'
    job.candidates[candidateIndex].status = "Rejected";

    // Save the job document
    await job.save();

    res.json({ success: true, message: "rejected successfully", job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error occur in reject " });
  }
};

//Apply for the job
export const Apply_Job = async (req, res) => {
  const { jobId } = req.body;

  console.log(req.body);
  // const userId = req.body.tokenDetails._id;
  // console.log(userId);
  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Jobs not found" });
    }

    console.log("Hi from jobs");

    try {
      const userId = req.body.tokenDetails._id;
      console.log("<<");
      console.log("user id is", userId);
      console.log("<<");

      const hasApplied = job.candidates.some(
        (candidate) => candidate.candidateId === userId
      );
      if (hasApplied) {
        return res.status(401).json({
          success: false,
          message: "You have already applied for the job",
        });
      }

      let resume = await MyResumeSchema.findOne({
        userId: userId,
      });

      if (!resume) {
        return res.send("No resume found");
      }

      console.log(resume);

      const base64Data = btoa(
        new Uint8Array(resume.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const newdata = {
        data: base64Data,
        id: userId,
        job_description: job.description,
      };

      console.log(newdata);

      console.log("new Data is", newdata);

      console.log("hey i am wating");

      const flaskResponse = await axios.post(
        "http://127.0.0.1:9999/predict",
        newdata
      );

      console.log("Flask response:", flaskResponse.data);
      const candidates_var = {
        candidateId: userId,
        ATS_Score: flaskResponse.data.ATS,
      };
      job.candidates.sort((a, b) => b.ATS_Score - a.ATS_Score);
      job.candidates.push(candidates_var);
      job.candidates.sort((a, b) => b.ATS_Score - a.ATS_Score);

      console.log("final job is", job);
      await job.save();

      return res
        .status(200)
        .json({ message: "Successfully applied for the job" });
    } catch (error) {
      res.status(401).send({
        success: false,
        message: "Error in token verification",
      });
    }

    // console.log(candidates_var);

    // job.candidates.push(candidates_var);
    // job.candidates.push(userId);
  } catch (error) {
    console.error("Error Applying for the job", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// tokenDetails
export const tokenDetails = async (req, res) => {
  const token = req.body;
  const userType = req.body;
  if (userType == "CANDIDATE") {
    const decode = JWT.verify(token, process.env.JWT_SECRET_CANDIDATE);
    return res
      .status(200)
      .json({ msg: "token decoded successfully", data: decode });
  }
};

// Route for file upload
export const fileUpload = async (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
  }

  try {
    // Create new instance of File model
    const newFile = new ResumeFile({
      filename: req.body.customFileName || file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
      userId: file.userId,
    });

    // Save file to MongoDB
    await newFile.save();
    res.send("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    next(error);
  }
};

// job status
export const jobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const { active } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { active, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).send({ message: "Job not found" });
    }

    res.send(updatedJob);
  } catch (error) {
    res.status(500).send({ message: "Error occur in jobstatus" });
  }
};

// get from recruiterId

export const getRecruiterId = async (req, res) => {
  const recruiterId = req.query.recruiterId;

  if (!recruiterId) {
    return res
      .status(400)
      .send({ message: "recruiterId query parameter is required" });
  }

  try {
    const jobs = await Job.find({ createdBy: recruiterId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).send({ message: "Error fetching jobs" });
  }
};
