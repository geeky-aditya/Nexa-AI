import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const router = express.Router();


// ================= SIGNUP =================

router.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
        );

    res.status(201).json({
    message: "User registered successfully",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
});

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});


// login route
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try {

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }


        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordCorrect) {
            return res.status(400).json({
                error: "Invalid email or password"
            });
        }


        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Something went wrong"
        });

    }
});

export default router;