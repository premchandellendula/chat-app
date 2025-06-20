import express from 'express'
import cors from 'cors'
import rootRouter from './routes/index'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/v1', rootRouter)

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error)
})

const server = app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`)
})

import { Server } from 'socket.io'
const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173"
    }
})

io.on("connection", (socket) => {
    console.log("Connected to socket.io")

    socket.on("setup", (userData) => {
        if (!userData || !userData._id) {
            console.log("Invalid userData:", userData);
            return;
        }

        socket.join(userData._id);
        // console.log(userData._id)
        socket.emit("connected")
    })

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User joined room: ", room)
    })

    socket.on("typing", (room) => {
        socket.in(room).emit("typing")
    })

    socket.on("stop typing", (room) => {
        socket.in(room).emit("stop typing")
    })

    socket.on("new message", (newMessage) => {
        const chat = newMessage.chatId;
        // console.log(newMessage)
        // console.log(chat.users)
        if(!chat.users){
            console.log("chat.users is not defined");
            return;
        }

        chat.users.forEach((user: any) => {
            if(user._id === newMessage.userId._id) return;
            // console.log(user._id)
            // console.log(newMessage.message)
            socket.in(user._id).emit("message received", newMessage)
        })
    })

    socket.off("setup", (userData) => {
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
})