import express from 'express';
import zod from 'zod'
import authMiddleware from '../../middlewares/authMiddleware';
import { Chat, Message } from '../../db';
const router = express.Router();

const messageBody = zod.object({
    message: zod.string(),
    chatId: zod.string()
})

// send a message
router.post('/', authMiddleware, async (req, res) => {
    const response = messageBody.safeParse(req.body)

    if(!response.success){
        res.status(400).json({
            message: "Incorrect inputs"
        })
        return;
    }

    const { message, chatId } = req.body;

    try{
        let newMessage = await Message.create({
            message,
            chatId,
            userId: req.userId
        });

        newMessage = await newMessage
            .populate("userId", "name imageUrl")

        newMessage = await newMessage.populate({
            path: "chatId",
            populate: {
                path: "users",
                select: "name email imageUrl"
            }
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: newMessage
        })

        // console.log(newMessage)
        res.status(201).json({
            message: "Message sent successfully",
            newMessage
        });
    }catch(err){
        console.error("Error sending message: ", err);
        res.status(500).json({
            message: "Failed to send message"
        });
    }
})

// get all messages from the chat
router.get('/:chatId', authMiddleware, async (req, res) => {
    const { chatId } = req.params;

    try{
        const messages = await Message.find({chatId})
                                        .populate("userId", "name email imageUrl")
                                        .populate("chatId")
        
        res.status(200).json({
            message: "Messages fetched successfully",
            messages
        })


    }catch(err){
        console.error("Error fetching message: ", err);
        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
})

export default router;