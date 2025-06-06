import express from 'express'
const router = express.Router()
import authRouter from './auth/auth'
import searchRouter from './search/usersearch'
import chatRouter from './chat/chat'
import messageRouter from './message/message'

router.use('/auth', authRouter)
router.use('/search', searchRouter)
router.use('/chat', chatRouter)
router.use('/message', messageRouter)

export default router