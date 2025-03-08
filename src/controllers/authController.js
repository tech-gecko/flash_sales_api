import User from "../models/User.js";
import { hash ,compare } from "bcryptjs";

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hash(password, 12);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Registration successful! Proceed to log in",
      redirectUrl: "/login"
    });
  } catch (err) {
    if (err.code === 11000) { // Handle mongoose duplicate user error
      return res.status(400).json({ error: "Email already exists" });
    }
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

    return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        data: { userId: user._id} 
    });
  } catch (err) {
    next(err);
  }
};
