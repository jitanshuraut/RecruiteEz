import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      default: 0,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    jobTrackerId: {
      type: Object,
    },
    jobAppliedId: {
      type: Object,
    },
    profilePath: {
      type: String,
    },
    intro: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const recruiterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 1,
    },
    gender: {
      type: Number,
      default: 0,
    },
    jobPostId: {
      type: Object,
    },
    company: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Candidate = mongoose.model("Candidate", candidateSchema);
const Recruiter = mongoose.model("Recruiter", recruiterSchema);

export { Candidate, Recruiter };
