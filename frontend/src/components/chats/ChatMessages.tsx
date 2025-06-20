import { useEffect, useRef } from "react"
import { isSameUser } from "../config/chatLogics"
import { useUser } from "../hooks/useUser"
import Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

interface IChatMessages {
    messages: any[],
    isTyping?: boolean
}

const ChatMessages = ({messages, isTyping=false}: IChatMessages) => {
    const messageEndRef = useRef<HTMLDivElement>(null)
    const { user } = useUser()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        renderSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({behavior: "auto"})
    }, [messages, isTyping])
    return (
        <div className="mb-2 flex flex-col overflow-y-auto px-1 py-2">
            {messages.map((message: any, i: any) => (
                <div key={i} className="flex items-end">
                    <div style={{
                            marginTop: isSameUser(messages, message, i) ? 4 : 10
                        }} 
                        className={`rounded-br-xl rounded-bl-xl px-3 py-1 max-w-[50%] text-sm leading-relaxed ${
                            message.userId._id === user?._id
                                ? "ml-auto bg-green-500 text-white dark:bg-green-600 rounded-tl-xl"
                                : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 rounded-tr-xl"
                        }`}>{message.message}
                    </div>
                </div>
            ))}

{isTyping ? (
    <div style={{
        width: '50px',
        height: '50px',
        margin: 0,
        padding: 0,
        marginLeft: 5,
        position: 'relative'
    }}>
        <Lottie
            width={80}
            height={80}
            options={defaultOptions}
            style={{
                margin: 0,
                padding: 0,
                position: 'absolute',
                left: '-20px'
            }}
        />
    </div>
) : (
    <></>
)}

            <div ref={messageEndRef} ></div>
        </div>
    )
}

export default ChatMessages