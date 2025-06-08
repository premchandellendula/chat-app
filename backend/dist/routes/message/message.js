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
const zod_1 = __importDefault(require("zod"));
const authMiddleware_1 = __importDefault(require("../../middlewares/authMiddleware"));
const db_1 = require("../../db");
const router = express_1.default.Router();
const messageBody = zod_1.default.object({
    message: zod_1.default.string(),
    chatId: zod_1.default.string()
});
// send a message
router.post('/', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = messageBody.safeParse(req.body);
    if (!response.success) {
        res.status(400).json({
            message: "Incorrect inputs"
        });
        return;
    }
    const { message, chatId } = req.body;
    try {
        let newMessage = yield db_1.Message.create({
            message,
            chatId,
            userId: req.userId
        });
        newMessage = yield newMessage
            .populate("userId", "name imageUrl");
        newMessage = yield newMessage.populate({
            path: "chatId",
            populate: {
                path: "users",
                select: "name email imageUrl"
            }
        });
        yield db_1.Chat.findByIdAndUpdate(chatId, {
            latestMessage: newMessage
        });
        res.status(201).json({
            message: "Message sent successfully",
            newMessage
        });
    }
    catch (err) {
        console.error("Error sending message: ", err);
        res.status(500).json({
            message: "Failed to send message"
        });
    }
}));
// get all messages from the chat
router.get('/:chatId', authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const messages = yield db_1.Message.find({ chatId })
            .populate("userId", "name email imageUrl")
            .populate("chatId");
        res.status(200).json({
            message: "Messages fetched successfully",
            messages
        });
    }
    catch (err) {
        console.error("Error fetching message: ", err);
        res.status(500).json({
            message: "Failed to fetch messages"
        });
    }
}));
exports.default = router;
