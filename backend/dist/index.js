"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./routes/index"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use('/api/v1', index_1.default);
app.get('/', (req, res) => {
    res.send("API is working 🚀");
});
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
});
const socket_io_1 = require("socket.io");
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        if (!userData || !userData._id) {
            console.log("Invalid userData:", userData);
            return;
        }
        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: ", room);
    });
    socket.on("typing", (room) => {
        socket.in(room).emit("typing");
    });
    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing");
    });
    socket.on("new message", (newMessage) => {
        const chat = newMessage.chatId;
        // console.log(newMessage)
        // console.log(chat.users)
        if (!chat.users) {
            console.log("chat.users is not defined");
            return;
        }
        chat.users.forEach((user) => {
            if (user._id === newMessage.userId._id)
                return;
            // console.log(user._id)
            // console.log(newMessage.message)
            socket.in(user._id).emit("message received", newMessage);
        });
    });
    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});
