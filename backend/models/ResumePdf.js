import mongoose from "mongoose";

const ResumeCandidateSchema = new mongoose.Schema({
  contentType: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  userId: {
    type: String,
  },
});

const MyResumeSchema = mongoose.model("MyResumeSchema", ResumeCandidateSchema);

export default MyResumeSchema;
