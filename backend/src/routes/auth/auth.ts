import express from 'express'
const router = express.Router()
import zod from 'zod'
import * as argon2 from "argon2";
import jwt from 'jsonwebtoken'
import { User } from '../../db';
import authMiddleware from '../../middlewares/authMiddleware';

const signupBody = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6),
    confirmPassword: zod.string().min(6),
    imageUrl: zod.string().optional()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

router.post('/signup', async (req, res): Promise<void> => {
    const response = signupBody.safeParse(req.body);

    if(!response.success){
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const { name, email, password, imageUrl } = req.body;

    try {
        const hashedPassword = await argon2.hash(password)

        const user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            imageUrl: imageUrl
        })

        if(!user){
            throw new Error("Failed to create user")
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if(!JWT_SECRET){
            throw new Error("JWT_SECRET not defined")
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "2d"})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
            sameSite: "none",
            secure: true
        })

        res.status(201).json({
            message: "User created successfully",
            data: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        })

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error instanceof Error ? error.message : "Unknown error",
        })
    }
})

const signinBody = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6)
})

router.post('/signin', async (req, res) => {
    const response = signinBody.safeParse(req.body)

    if(!response.success){
        res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            email: email
        })

        if(!user || !user.password){
            throw new Error("User not found or password missing")
            return;
        }

        const isPasswordValid = await argon2.verify(user.password, password)

        if(!isPasswordValid){
            res.status(400).json({
                message: "Incorrect password"
            })
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        if(!JWT_SECRET){
            throw new Error("JWT_SECRET not defined")
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: "2d"})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 2, // 2 days
            sameSite: "none",
            secure: true
        })

        res.status(200).json({
            message: "User signed in successfully",
            // token: req.headers.cookie
            // token: req.cookies.token
            data: {
                name: user.name,
                email: user.email,
                imageUrl: user.imageUrl
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Error logging user",
            error: error instanceof Error ? error.message : "Unknown error",
        })
    }
})

router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        }).select("-password")

        res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch (err) {
        console.log("Error fetching the user: ", err)
        res.status(500).json({
            message: "Error fetching user",
        })
    }
})

router.post('/logout', authMiddleware, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
        secure: false // or true in production over HTTPS
    })  // empty the cookie or just do res.clearCookie("token")
    res.json({
        message: "Logged out"
    })
})

export default router