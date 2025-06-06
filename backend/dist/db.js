"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.Message = exports.Chat = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const value = process.env.DATABASE_URL;
mongoose_1.default.connect(value)
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("Could not connect to MongoDB...", err));
const chatSchema = new mongoose_1.default.Schema({
    chatName: {
        type: String,
        required: true,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
        trim: true
    },
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});
const messageSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    chatId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, {
    timestamps: true
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
}, {
    timestamps: true
});
exports.Chat = mongoose_1.default.model("Chat", chatSchema);
exports.Message = mongoose_1.default.model("Message", messageSchema);
exports.User = mongoose_1.default.model("User", userSchema);
