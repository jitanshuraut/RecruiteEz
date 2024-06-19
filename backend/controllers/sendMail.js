import nodemailer from "nodemailer";
import { Recruiter } from "../models/candidateModel.js";
import { Candidate } from "../models/candidateModel.js";
import { Email, PassKey } from "../config.js";

export const sendMail = async (recruiterId, candidateId, interviewDate) => {
  const recruiter =
    (await Recruiter.findById(recruiterId)) || "Unknown Recruiter";
  const candidate =
    (await Candidate.findById(candidateId)) || "Unknown Candidate";

  if (!recruiter || !candidate) {
    console.error("Recruiter or Candidate not found");
    return "Recruiter or Candidate not found";
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: Email,
      pass: PassKey,
    },
  });

  const emailSubject = `Interview Invitation for a Role at ${recruiter.company}`;
  const emailHtmlContent = `
        <p>Dear ${candidate.name},</p>
        <p>Thank you for applying to our recent job opening. I am ${recruiter.name}, from ${recruiter.company}, and I am pleased to invite you to the next stage of our recruitment process.</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
            <li><strong>Date:</strong> ${interviewDate}</li>
            <li><strong>Duration:</strong> Approximately 1 hour</li>
        </ul>
        <p>Your brief introduction was very insightful, and we are looking forward to discussing your application in more detail.</p>
        <p>Please confirm your availability for this schedule, or suggest an alternative time that may suit you better.</p>
        <p>If you have any questions or need further information, please do not hesitate to reach out directly at ${recruiter.email}.</p>
        <p>We look forward to meeting you soon!</p>
        <p>Best regards,</p>
        <p>${recruiter.name}<br>${recruiter.company}</p>
    `;

  try {
    const info = await transporter.sendMail({
      from: {
        name: `Recruiter ${recruiter.name}`,
        address: "ui21cs27jitanshu@gmail.com",
      },
      to: [`${candidate.email}`], // list of receivers
      subject: emailSubject, // Subject line
      // text: "Hello world?", // plain text body
      html: emailHtmlContent, // html body
    });

    console.log("Message sent:", info);
    return "Mail sent successfully";
  } catch (error) {
    console.error("Error sending email: ", error);
    return "Failed to send email";
  }
};
