import { uploadImageToCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { User } from "../models/user.js";
import { error } from "console";



const generateTokens = async (user_id) => {

  const user = await User.findById(user_id);
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;

  await user.save();

  return { refreshToken };
}
export const signup = async (req, res) => {
  try {
    const { name, y_id, password } = req.body;
    console.log("Received signup data:", req.body);

    const existingUser = await User.findOne({ y_id });
    if (existingUser) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "User already exists" });
    }

    let profilePicUrl = "";
    if (req.file) {
      const result = await uploadImageToCloudinary(req.file.path);
      console.log("Cloudinary result:", result);

      profilePicUrl = result.secure_url;
      // fs.unlinkSync(req.file.path); // ✅ This line can be safely re-enabled
    }

    const user = new User({
      name,
      y_id,
      profilePic: profilePicUrl,
      password,
    });

    await user.save();
    console.log("User saved:", user);

    res.status(201).json({
      message: "Signup successful",
      user: { name: user.name, y_id: user.y_id, profilePic: user.profilePic },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};


export const login = async (req, res) => {
  try {
    const { y_id, password } = req.body;

    const user = await User.findOne({ y_id });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const { refreshToken } = await generateTokens(user._id);

   

    res.json({
      message: "Login successful",
      user: {
        name: user.name,
        y_id: user.y_id,
        profilePic: user.profilePic,
        token: refreshToken
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};


export const getUserByYId = async (req, res) => {
  try {
    const user = await User.findOne({ y_id: req.params.y_id });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};
export const getTopContributors = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ contributeScore: -1 }) // Sort by contributeScore descending
      .select("name y_id profilePic contributeScore"); // Select only needed fields

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch top contributors" });
  }
};