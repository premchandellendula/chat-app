"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const db_1 = require("../../db");
const router = express_1.default.Router();
// create a chat or return if present already
router.post('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.body;
    if (!user_id) {
        res.status(400).json({
            message: "user id is not sent with the request"
        });
    }
    let isChat = yield db_1.Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.userId } } },
            { users: { $elemMatch: { $eq: user_id } } }
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = yield db_1.Chat.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email imageUrl"
    });
    if (isChat.length > 0) {
        res.status(200).json({
            message: "Fetched the user successfully",
            chat: isChat[0]
        });
    }
    else {
        try {
            const chat = yield db_1.Chat.create({
                chatName: "sender",
                isGroupChat: false,
                users: [req.userId, user_id]
            });
            const fullChat = yield db_1.Chat.findById(chat._id)
                .populate("users", "-password")
                .populate("latestMessage");
            const populatedChat = yield db_1.Chat.populate(fullChat, {
                path: "latestMessage.sender",
                select: "name email imageUrl"
            });
            res.status(201).json({
                message: "Chat created successfully",
                chat: populatedChat
            });
        }
        catch (err) {
            console.log("Error creating a chat: ", err);
            res.status(500).json({
                message: "Error creating a chat",
            });
        }
    }
}));
// fetching all the chats of the user
router.get('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = yield db_1.Chat.find({ users: { $elemMatch: { $eq: req.userId } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 });
        const populatedChats = yield db_1.Chat.populate(chats, {
            path: "latestMessage.sender",
            select: "name email imageUrl"
        });
        res.status(200).json({
            message: "Fetched chat successfully",
            chats
        });
    }
    catch (err) {
        console.log("Error fetching chats: ", err);
        res.status(500).json({
            message: "Error fetching the chats"
        });
    }
}));
// create a group chat
router.post('/group', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.users || !req.body.name) {
        res.status(400).json({
            message: "Expected inputs are not filled"
        });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
        res.status(400).json({
            message: "Atleast 2 users are needed to create a group chat"
        });
    }
    users.push(req.userId);
    try {
        const groupChat = yield db_1.Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.userId
        });
        const fullGroupChat = yield db_1.Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(201).json({
            message: "Group chat created successfully",
            groupChat: fullGroupChat
        });
    }
    catch (error) {
        console.log("Error fetching the chat: ", error);
        res.status(500).json({
            message: "Error creating the group chat"
        });
    }
}));
// rename a group chat
router.put('/group', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, chatName } = req.body;
    try {
        const groupChat = yield db_1.Chat.findById(chatId);
        if (!groupChat) {
            res.status(400).json({
                message: "ChatId is invalid"
            });
            return;
        }
        const updatedChat = yield db_1.Chat.findByIdAndUpdate(chatId, {
            chatName
        }, {
            new: true
        }).populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json({
            message: "Group chat created successfully",
            groupChat: updatedChat
        });
    }
    catch (err) {
        console.log("Error updating the group chat: ", err);
        res.status(500).json({
            message: "Error updating the group chat"
        });
    }
}));
// add someone to a group chat
router.put('/addusertogroup', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, user_id } = req.body;
    try {
        const groupChat = yield db_1.Chat.findById(chatId);
        if (!groupChat) {
            res.status(400).json({
                message: "ChatId is invalid"
            });
            return;
        }
        const user = yield db_1.User.findById(user_id);
        if (!user) {
            res.status(400).json({
                message: "user_id is not valid"
            });
            return;
        }
        const userAdd = yield db_1.Chat.findByIdAndUpdate(chatId, {
            $push: { users: user_id }
        }, {
            new: true
        }).populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(201).json({
            message: "Added user to the group",
            groupChat: userAdd
        });
    }
    catch (err) {
        console.log("Error adding the user to the group chat: ", err);
        res.status(500).json({
            message: "Error adding the user to the group chat"
        });
    }
}));
// remove someone from a group chat
router.put('/removeuserfromgroup', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, user_id } = req.body;
    try {
        const groupChat = yield db_1.Chat.findById(chatId);
        if (!groupChat) {
            res.status(400).json({
                message: "ChatId is invalid"
            });
            return;
        }
        const user = yield db_1.User.findById(user_id);
        if (!user) {
            res.status(400).json({
                message: "user_id is not valid"
            });
            return;
        }
        const userRemove = yield db_1.Chat.findByIdAndUpdate(chatId, {
            $pull: { users: user_id }
        }, {
            new: true
        }).populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(201).json({
            message: "Removed user from the group",
            groupChat: userRemove
        });
    }
    catch (err) {
        console.log("Error removing the user from the group chat: ", err);
        res.status(500).json({
            message: "Error removing the user from the group chat"
        });
    }
}));
exports.default = router;
