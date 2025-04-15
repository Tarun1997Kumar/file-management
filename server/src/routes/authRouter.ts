import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { generateToken } from "../util/jwt";
import Role from "../models/role";

const authRouter = express.Router();

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find 'user' role automatically
    const userRole = await Role.findOne({ name: "user" });
    if (!userRole) {
      res.status(500).json({ message: "Role configuration error" });
      return;
    }

    // Existing validation
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Create user with default role
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: userRole._id,
    });

    const token = generateToken(user._id.toString(), userRole.name);

    res.status(201).json({ token, userId: user._id, role: userRole.name });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
    console.error(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const role = await Role.findOne({ _id: user.role });
    if (!role) {
      res.status(500).json({ message: "Role configuration error" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), role.name);
    res.status(201).json({
      token,
      userId: user._id,
      role: role.name,
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

export default authRouter;
