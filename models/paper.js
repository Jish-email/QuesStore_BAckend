import mongoose from "mongoose";

const paperSchema = new mongoose.Schema({
  branch: { type: String, required: true },
  subject: { type: String, required: true },
  year: { type: String, required: true },
  session: { type: String, required: true }, // e.g., "May-June"
  fileData: { type: Buffer, required: true }, // Store PDF or image as binary
  fileType: { type: String, required: true }, // Store mimetype (e.g., "application/pdf")
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Paper", paperSchema);