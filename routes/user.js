import express from "express";
import { signup, login, getTopContributors, getUserByYId } from "../controllers/userController.js";
import {upload} from "../middleware/multer.js";
const router = express.Router();

router.post("/signup", upload.single("profilePic"), signup);
router.post("/login", login);

router.get("/getalluser", getTopContributors);

router.get("/:y_id", getUserByYId);

export default router;