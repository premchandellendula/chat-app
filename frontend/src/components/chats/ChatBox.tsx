import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { useChat } from "../../pages/other/ChatProvider"
import { getSender, getSenderFullDetails } from "../config/chatLogics"
import ProfileDialog from "../dialog/ProfileDialog"
import { useUser } from "../hooks/useUser"
import Eye from "../icons/Eye"
import UpdateGroupChatModal from "../dialog/UpdateGroupChatModal"
import Send from "../icons/Send"
import { toast } from "sonner"
import axios from "axios"
import { BACKEND_ENDPOINT, BACKEND_URL } from "../../config"
import Spinner from "../loaders/Spinner"
import ChatMessages from "./ChatMessages"
import { io, Socket } from "socket.io-client"

interface IChatsProps {
    fetchAgain: boolean,
    setFetchAgain: (e: boolean) => void
}

// let socket: Socket, selectedChatCompare: any;

const ChatBox = ({fetchAgain, setFetchAgain}: IChatsProps) => {
    const [messages, setMessages] = useState<any>([])
    const [newMessage, setNewMessage] = useState("")
    const { selectedChat } = useChat()
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    const socketRef = useRef<Socket | null>(null)
    const selectedChatRef = useRef<any>(null)
    const { user } = useUser()

    useEffect(() => {
        if (!user || socketRef.current?.connected) return;

        // console.log("Initializing socket connection...")
        socketRef.current = io(BACKEND_ENDPOINT)
        socketRef.current.emit("setup", user)
        socketRef.current.on("connected", () => setSocketConnected(true))

        socketRef.current.on("typing", () => setIsTyping(true))
        socketRef.current.on("stop typing", () => setIsTyping(false))

        socketRef.current.on("message received", (newMessageReceived) => {
            console.log("Message received:", newMessageReceived)
            
            // Check if the message belongs to the currently selected chat
            if (!selectedChatRef.current || 
                selectedChatRef.current._id !== newMessageReceived.chatId._id) {
                console.log("Message not for current chat, showing notification")
                // TODO: Show notification
                return
            }

            // Add message to current chat
            setMessages((prevMessages: any) => [...prevMessages, newMessageReceived])
        })

        socketRef.current.on("disconnect", () => {
            console.log("Socket disconnected")
            setSocketConnected(false)
        })

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null
                setSocketConnected(false)
            }
        };
    }, [user])

    useEffect(() => {
        if(!selectedChat){
            selectedChatRef.current = null
            return
        }

        console.log("Selected chat changes: ", selectedChat._id)
        selectedChatRef.current = selectedChat
        fetchMessages()
    }, [selectedChat])

    const fetchMessages = async () => {
        if(!selectedChat || !socketRef.current) return;
        setLoading(true)

        try {
            const response = await axios.get(`${BACKEND_URL}/message/${selectedChat._id}`, {
                withCredentials: true
            })
            // console.log(response.data.messages)
            setMessages(response.data.messages)

            socketRef.current.emit("join chat", selectedChat._id)
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Something went wrong";
            
            console.log("Error fetcing message: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    const handleSendMessage = async (e?: React.KeyboardEvent | React.MouseEvent) => {
        e?.preventDefault()

        if(!newMessage.trim()){
            toast.warning("Please enter a message")
            return
        }

        if(!selectedChat || !socketRef.current){
            toast.error("Chat not selected or connection lost")
            return;
        }

        const messageToSend = newMessage.trim()
        setNewMessage("")

        try {
            // setNewMessage("")
            const response = await axios.post(`${BACKEND_URL}/message`, {
                chatId: selectedChat?._id,
                message: messageToSend
            }, {
                withCredentials: true
            })
            // console.log(response.data.newMessage)
            socketRef.current.emit("new message", response.data.newMessage)
            setMessages((prevMessages: any) => [...prevMessages, response.data.newMessage])

            socketRef.current.emit("stop typing", selectedChat._id)
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Something went wrong";
            
            console.log("Error sending message: ", err)
            toast.error(errorMessage)

            setNewMessage(messageToSend)
        }
    }

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)

        // Typing Indicator logic
        if(!socketConnected) return

        if(!typing){
            setTyping(true)
            socketRef.current?.emit("typing", selectedChat?._id)
        }

        let lastTypingTime= new Date().getTime()
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime()

            let timeDiff = timeNow - lastTypingTime

            if(timeDiff >= timerLength || typing){
                socketRef.current?.emit("stop typing", selectedChat?._id)
                setTyping(false)
            }
        }, timerLength)
    }

    return (
        <div className="w-[65%] dark:bg-[#0a0b1b] flex flex-col border-l border-gray-300 dark:border-gray-800 h-full">
            {selectedChat ? (
                <>
                    <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300 dark:border-gray-800">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {!selectedChat.isGroupChat ? (
                                <div className="flex items-center gap-1">
                                    <img src={getSenderFullDetails(user, selectedChat.users).imageUrl} alt={getSenderFullDetails(user, selectedChat.users).name} className="w-7 h-7 rounded-full" />
                                    <span className="text-xl mb-1">
                                        {getSender(user, selectedChat.users)}
                                    </span>
                                </div>
                            ) : (
                                selectedChat.chatName
                            )}
                        </h2>
                        <Eye
                            onClick={() =>
                                selectedChat.isGroupChat
                                ? setIsGroupChatModalOpen(true)
                                : setIsProfileDialogOpen(true)
                            }
                        />
                    </div>
                    
                    {isProfileDialogOpen && <ProfileDialog user={getSenderFullDetails(user, selectedChat.users)} isDialogOpen={isProfileDialogOpen} setIsDialogOpen={setIsProfileDialogOpen} />}

                    {isGroupChatModalOpen && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} isGroupChatModalOpen={isGroupChatModalOpen} setIsGroupChatModalOpen={setIsGroupChatModalOpen} />}

                    <div className="flex-grow overflow-y-auto px-1">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <Spinner />
                            </div>
                        ) : (
                            <ChatMessages messages={messages} isTyping={isTyping} />
                        )}
                    </div>
                    
                    <div className="relative border-t border-gray-300 dark:border-gray-800 px-2 py-1.5">
                        <input 
                        type="text" 
                        name="newmessage" 
                        id="newmessage" 
                        placeholder="Enter a message" 
                        onChange={typingHandler}
                        value={newMessage}
                        className="p-2 w-full h-12 border border-gray-200 dark:border-gray-800 dark:text-white dark:bg-[#16172b] bg-gray-100 rounded-md focus:ring-2 focus:ring-green-100/80 dark:focus:ring-gray-800 outline-none pr-10"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSendMessage(e);
                        }}
                        />

                        <Send onClick={handleSendMessage} />
                    </div>
                </>
            ): (
                <div className="flex justify-center items-center text-2xl font-semibold text-gray-600 dark:text-gray-300 h-full">
                    Click on a user to start chatting
                </div>
            )}
        </div>
    )
}

export default ChatBox