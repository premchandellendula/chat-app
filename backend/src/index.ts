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
        socket.join(userData._id);
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
        let chat = newMessage.chat;

        if(!chat.users){
            return console.log("chat.users is not defined");
        }

        chat.users.forEach((user: any) => {
            if(user._id === newMessage.userId) return;

            socket.in(user._id).emit("message received", newMessage)
        })
    })
})