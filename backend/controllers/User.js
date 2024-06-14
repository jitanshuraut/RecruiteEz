import axios from "axios";
import { Candidate, Recruiter } from "../models/candidateModel.js";
import ProfileImg from "../models/ProfileImg.js";
import MyResumeSchema from "../models/ResumePdf.js";

// POST - Create a new user
export const createUser = async (req, res) => {
  try {
    const user = new Candidate(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
};

// GET - Retrieve all users
export const retrieve = async (req, res) => {
  try {
    const users = await Candidate.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

// GET - Retrieve a user by ID
export const retrieveByID = async (req, res) => {
  try {
    console.log("boy is", req.body);
    console.log(req.params);
    console.log(req.body.userId);
    console.log(req.body.role);
    // const file = req.file;

    // console.log(file);
    // console.log(req.headers);

    // const role = req.headers["User-Role"];
    // console.log(role);
    // console.log(typeof role);

    if (req.params.role == "0") {
      const candidate = await Candidate.findById(req.params.userId);

      if (!candidate) {
        return res.status(404).send();
      }

      res.send(candidate);
    } else {
      const recruiter = await Recruiter.findById(req.params.userId);

      if (!recruiter) {
        return res.status(404).send();
      }

      res.send(recruiter);
    }

    res.send(req.params);
  } catch (error) {
    res.status(500).send();
  }
};

// PUT - Update a user by ID
export const update = async (req, res) => {
  if (req.body.role == "1") {
    // console.log("Recruiter");

    try {
      const recruiter = await Recruiter.findById(req.params.userId);
      console.log(recruiter);

      const updatedRecruiter = await Recruiter.findByIdAndUpdate(
        req.params.userId,
        {
          name: req.body.name || recruiter.name,
          company: req.body.company || recruiter.company,
        },
        {
          new: true,
        }
      );

      await updatedRecruiter.save();

      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        updatedRecruiter,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Error While Updating Recruiter profile",
        error,
      });
    }
  } else {
    // console.log("Candidate");

    try {
      const candidate = await Candidate.findById(req.params.userId);
      console.log(candidate);

      const updatedCandidate = await Candidate.findByIdAndUpdate(
        req.params.userId,
        {
          name: req.body.name || candidate.name,
          // company: req.body.company || candidate.company,
        },
        {
          new: true,
        }
      );

      let myResume = await MyResumeSchema.findOne({
        userId: req.params.userId,
      });
      console.log("profile Image is", myResume);

      // console.log("prod::",profileImg);

      // If profileImg is null (i.e., no document found), create a new one
      if (!myResume) {
        // Handle case where user ID doesn't exist
        // console.log("no find");
        const newFile = new MyResumeSchema({
          userId: req.params.userId,
          contentType: file.mimetype,
          data: file.buffer,
        });

        await newFile.save();

        console.log(newFile);
        res.status(200).send({
          success: true,
          message: "Profile Updated Successfully",
          updatedCandidate,
        });

        // res.send(profileImg);
        // console.log(newFile);
      } else {
        // Update the existing document with the new data

        const updateResume = await MyResumeSchema.findOneAndUpdate(
          { userId: req.params.userId },

          {
            contentType: file.mimetype || myResume.mimetype,
            data: file.buffer || myResume.buffer,
          },
          {
            new: true,
          }
        );

        console.log(updateImage);
        console.log("saved");

        res.status(200).send({
          success: true,
          message: "Profile Updated Successfully",
          updateResume,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Error While Updating Recruiter profile",
        error,
      });
    }
  }
};

// DELETE - Delete a user by ID
export const deleteUser = async (req, res) => {
  try {
    const user = await Candidate.findByIdAndDelete(req.params.userId);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

// profile img
export const profileImage = async (req, res) => {
  try {
    const userId = req.query.userId; // Extract userId from query parameters
    console.log("userId:", userId);

    const file = await ProfileImg.findOne({ userId: userId });
    if (!file) {
      return res.status(404).send("File not found");
    }

    res.set("Content-Type", file.contentType); // Set content type based on file
    res.send(file.data);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateCandidate = async (req, res) => {
  const file = req.file;

  try {
    const candidate = await Candidate.findById(req.params.userId);
    console.log(candidate);
    if (!candidate) {
      return res
        .status(404)
        .json({ success: false, message: "Candidate not found" });
    }

    const updatedCandidate = await Candidate.findByIdAndUpdate(
      req.params.userId,
      {
        name: req.body.name || candidate.name,
      },
      {
        new: true,
      }
    );

    let resume = await MyResumeSchema.findOne({
      userId: req.params.userId,
    });

    console.log("profile Image is", resume);

    if (!resume) {
      const newFile = new MyResumeSchema({
        userId: req.params.userId,
        contentType: file.mimetype,
        data: file.buffer,
      });

      await newFile.save();
      resume = newFile;

      const newdata = {
        data: file.buffer.toString("base64"),
        id: req.params.userId,
        job_description: "hi",
      };

      // const flaskResponse = await axios.post(
      //   "http://localhost:9999/predict",
      //   newdata
      // );

      // console.log("Flask response:", flaskResponse.data);

      console.log(newFile);
      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        updatedCandidate,
        resume,
      });

      // res.send(profileImg);
      // console.log(newFile);
    } else {
      const updateResume = await MyResumeSchema.findOneAndUpdate(
        { userId: req.params.userId },

        {
          contentType: file.mimetype || resume.mimetype,
          data: file.buffer || resume.buffer,
        },
        {
          new: true,
        }
      );

      console.log(updateResume);
      console.log("saved");

      const newdata = {
        data: file.buffer.toString("base64"),
        id: req.params.userId,
        job_description: "hi",
      };

      console.log("new Data is", newdata);

      // const flaskResponse = await axios.post(
      //   "http://localhost:9999/predict",
      //   newdata
      // );

      // console.log("Flask response:", flaskResponse.data);

      res.status(200).send({
        success: true,
        message: "Profile Updated Successfully",
        updateResume,
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error While Updating Recruiter profile",
      error,
    });
  }
};

export const updateRecruiter = async (req, res) => {
  try {
    const { name, company, role } = req.body;

    const recruiter = await Recruiter.findById(req.params.userId);
    if (!recruiter) {
      return res
        .status(404)
        .json({ success: false, message: "Recruiter not found" });
    }

    recruiter.name = name || recruiter.name;
    recruiter.company = company || recruiter.company;
    recruiter.role = role || recruiter.role;

    const updatedRecruiter = await recruiter.save();

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedRecruiter,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send({ success: false, message: "Error updating profile" });
  }
};
