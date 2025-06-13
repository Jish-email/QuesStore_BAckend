import Paper from "../models/paper.js";
import { User } from "../models/user.js"; // Import User model
import fs from "fs";

export const uploadPaper = async (req, res) => {

  try {
    const { branch, subject, year, session } = req.body;
    const userId = req.user._id; // Get userId from auth middleware
    const filePath = req.file.path;

  


    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Remove local file after reading
    fs.unlinkSync(filePath);

    // Save file buffer in DB
    const paper = new Paper({
      branch,
      subject,
      year,
      session,
      fileData: fileBuffer,
      fileType: req.file.mimetype,
    });
    await paper.save();

    // Increment user's contributeScore
    let updatedScore = null;
    if (userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { contributeScore: 75 } },
        { new: true }
      );
      updatedScore = user?.contributeScore;
    }

    res.status(201).json({
      message: "Paper uploaded successfully",
      paper,
      contributeScore: updatedScore,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload paper" });
  }
};

export const getAllPapers = async (req, res) => {
  try {
    const papers = await Paper.find();
    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch papers" });
  }
};

export const getPapersBySubject = async (req, res) => {
  try {
    const { subject } = req.params;

    const papers = await Paper.find({ subject });
    (papers);

    res.json(papers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch papers by subject" });
  }
};

export const deletePaperById = async (req, res) => {
  try {
    await Paper.findByIdAndDelete(req.params.id);
    res.json({ message: "Paper deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete paper" });
  }
};

export const downloadPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const paper = await Paper.findById(paperId);

    if (!paper || !paper.fileData) {
      return res.status(404).json({ error: "Paper not found" });
    }

    res.set({
      "Content-Type": paper.fileType,
      "Content-Disposition": `attachment; filename="paper_${paper.year}_${paper.session}${paper.fileType === "application/pdf" ? ".pdf" : ""}"`,
    });

    res.send(paper.fileData);
  } catch (err) {
    res.status(500).json({ error: "Failed to download paper" });
  }
};
