import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose'

const value = process.env.DATABASE_URL as string
mongoose.connect(value)
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("Could not connect to MongoDB...", err))

interface IChat {
    chatName: string;
    isGroupChat: boolean;
    users: mongoose.Types.ObjectId[];
    latestMessage: mongoose.Types.ObjectId;
    groupAdmin: mongoose.Types.ObjectId
}

const chatSchema = new mongoose.Schema<IChat>({
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
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        trim: true
    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

interface IMessage {
    message: string,
    userId: mongoose.Types.ObjectId,
    chatId: mongoose.Types.ObjectId
}

const messageSchema = new mongoose.Schema<IMessage>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
}, {
    timestamps: true
})

interface IUser {
    name: string,
    email: string,
    password: string,
    imageUrl: string
}

const userSchema = new mongoose.Schema<IUser>({
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
})


export const Chat = mongoose.model<IChat>("Chat", chatSchema);
export const Message = mongoose.model<IMessage>("Message", messageSchema);
export const User = mongoose.model<IUser>("User", userSchema);