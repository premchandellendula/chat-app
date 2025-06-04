import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
const app = express()
dotenv.config()
const PORT = process.env.PORT
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send("Hello Yangs!!")
})
app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`)
})