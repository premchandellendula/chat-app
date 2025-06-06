import express from 'express'
import cors from 'cors'
import rootRouter from './routes/index'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

app.use('/api/v1', rootRouter)

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error)
})

app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`)
})