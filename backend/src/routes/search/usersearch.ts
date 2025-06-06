import express from 'express';
import { User } from '../../db';
import authMiddleware from '../../middlewares/authMiddleware';
const router = express.Router();

router.get('/users', authMiddleware, async (req, res) => {
    const searchKeyWord = req.query.search ? {
        $or: [
            {name: { $regex: req.query.search, $options: "i"}},
            {email: { $regex: req.query.search, $options: "i"}},
        ]
    } : {}
    // console.log(searchKeyWord)
    try {
        const users = await User.find(searchKeyWord).find({ _id: { $ne: req.userId }})

        if (users.length === 0) {
            res.status(404).json({ message: "No users found" });
            return;
        }

        res.status(200).json({
            message: "User fetched successfully",
            users
        })
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({
            message: "An unexpected error occurred while fetching users"
        });
    }
})

export default router;