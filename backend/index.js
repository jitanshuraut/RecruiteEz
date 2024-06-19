import { PORT, mongoDBURL } from "./config.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";
import interviewerRoutes from "./routes/interviewer.js";
import jobTrackerRoutes from "./routes/jobtracker.js";
import resumesAtsRoutes from "./routes/resumesAts.js";
import submittedResumesRoutes from "./routes/resumes.js";
import jobRoutes from "./routes/jobs.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

dotenv.config();
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skipFailedRequests: true,
});
//middlewares
app.use(express.json());
app.use(limiter);
app.use(morgan("dev"));
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  console.log(req);
  return res.status(200).send("Welcome ats");
});

app.use("/users", userRoutes);
app.use("/interviewer", interviewerRoutes);
app.use("/jobtracker", jobTrackerRoutes);
app.use("/resumesAts", resumesAtsRoutes);
app.use("/resumes", submittedResumesRoutes);
app.use("/jobs", jobRoutes);
app.use("/api/v1/auth", authRoutes);

mongoose.connect(mongoDBURL).then(() => {
  console.log("App is connected to the database");
  app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
  });
});
