import express from "express";
import { upload } from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";
import {
  uploadPaper,
  getAllPapers,
  getPapersBySubject,
  deletePaperById,
  downloadPaper
} from "../controllers/paperController.js";

const router = express.Router();

router.post("/upload",auth, upload.single("paperurl"),uploadPaper);

router.get("/getallpaper", getAllPapers);

router.get("/subject/:subject", getPapersBySubject);

router.delete("/:id", deletePaperById);
router.get("/download/:paperId", downloadPaper);


export default router;