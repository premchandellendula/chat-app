import express from 'express';
import authMiddleware from '../../middlewares/authMiddleware';
import { Chat, User } from '../../db';
import mongoose from 'mongoose';
const router = express.Router();

// create a chat or return if present already
router.post('/', authMiddleware, async (req, res) => {
    const { user_id } = req.body;

    if(!user_id){
        res.status(400).json({
            message: "user id is not sent with the request"
        })
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            {users: { $elemMatch: {$eq: req.userId} }},
            {users: { $elemMatch: {$eq: user_id }}}
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await Chat.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email imageUrl"
    })

    if(isChat.length > 0){
        res.status(200).json({
            message: "Fetched the user successfully",
            chat: isChat[0]
        })
    }else{
        try{
            const chat = await Chat.create({
                chatName: "sender",
                isGroupChat: false,
                users: [req.userId, user_id]
            })

            const fullChat = await Chat.findById(chat._id)
                                                    .populate("users", "-password")
                                                    .populate("latestMessage")
            
            const populatedChat = await Chat.populate(fullChat, {
                path: "latestMessage.sender",
                select: "name email imageUrl"
            })

            res.status(201).json({
                message: "Chat created successfully",
                chat: populatedChat
            })
        }catch(err){
            console.log("Error creating a chat: ", err)
            res.status(500).json({
                message: "Error creating a chat",
            })
        }
    }


})

// fetching all the chats of the user
router.get('/', authMiddleware, async (req, res) => {
    try{
        const chats = await Chat.find({users: {$elemMatch: {$eq: req.userId}}})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({updatedAt: -1})
        
        const populatedChats = await Chat.populate(chats, {
            path: "latestMessage.sender",
            select: "name email imageUrl"
        })
        res.status(200).json({
            message: "Fetched chat successfully",
            chats
        })
    }
    catch(err){
        console.log("Error fetching chats: ", err)
        res.status(500).json({
            message: "Error fetching the chats"
        })
    }
})

// create a group chat
router.post('/group', authMiddleware, async (req, res) => {
    if(!req.body.users || !req.body.name){
        res.status(400).json({
            message: "Expected inputs are not filled"
        })
    }

    let users = JSON.parse(req.body.users)

    if(users.length < 2){
        res.status(400).json({
            message: "Atleast 2 users are needed to create a group chat"
        })
    }

    users.push(req.userId)

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.userId
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        
        res.status(201).json({
            message: "Group chat created successfully",
            groupChat: fullGroupChat
        })
    } catch (error) {
        console.log("Error fetching the chat: ", error)
        res.status(500).json({
            message: "Error creating the group chat"
        })
    }
})

// rename a group chat
router.put('/group', authMiddleware, async (req, res) => {
    const { chatId, chatName } = req.body;

    try{
        const groupChat = await Chat.findById(chatId)
    
        if(!groupChat){
            res.status(400).json({
                message: "ChatId is invalid"
            })
            return;
        }
        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            chatName
        }, {
            new: true
        }).populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(200).json({
            message: "Group chat created successfully",
            groupChat: updatedChat
        })
    }catch(err){
        console.log("Error updating the group chat: ", err)
        res.status(500).json({
            message: "Error updating the group chat"
        })
    }
})

// add someone to a group chat
router.put('/addusertogroup', authMiddleware, async (req, res) => {
    const { chatId, user_id } = req.body;

    
    try{
        const groupChat = await Chat.findById(chatId)
    
        if(!groupChat){
            res.status(400).json({
                message: "ChatId is invalid"
            })
            return;
        }
    
        const user = await User.findById(user_id)
    
        if(!user){
            res.status(400).json({
                message: "user_id is not valid"
            })
            return;
        }
        const userAdd = await Chat.findByIdAndUpdate(chatId, {
            $push: {users: user_id}
        }, {
            new: true
        }).populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(201).json({
            message: "Added user to the group",
            groupChat: userAdd
        })
    }catch(err){
        console.log("Error adding the user to the group chat: ", err)
        res.status(500).json({
            message: "Error adding the user to the group chat"
        })
    }
})

// remove someone from a group chat
router.put('/removeuserfromgroup', authMiddleware, async (req, res) => {
    const { chatId, user_id } = req.body;

    
    try{
        const groupChat = await Chat.findById(chatId)
    
        if(!groupChat){
            res.status(400).json({
                message: "ChatId is invalid"
            })
            return;
        }
    
        const user = await User.findById(user_id)
    
        if(!user){
            res.status(400).json({
                message: "user_id is not valid"
            })
            return;
        }
        const userRemove = await Chat.findByIdAndUpdate(chatId, {
            $pull: {users: user_id}
        }, {
            new: true
        }).populate("users", "-password")
        .populate("groupAdmin", "-password")

        res.status(201).json({
            message: "Removed user from the group",
            groupChat: userRemove
        })
    }catch(err){
        console.log("Error removing the user from the group chat: ", err)
        res.status(500).json({
            message: "Error removing the user from the group chat"
        })
    }
})

export default router;