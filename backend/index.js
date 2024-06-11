import { PORT, mongoDBURL } from "./config.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

dotenv.config();
const app = express();

//middlewares
app.use(express.json());
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



mongoose.connect(mongoDBURL).then(() => {
  console.log("App is connected to the database");
  app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
  });
});
