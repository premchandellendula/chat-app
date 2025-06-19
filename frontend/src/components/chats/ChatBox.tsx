import { useEffect, useState, type ChangeEvent } from "react"
import { useChat } from "../../pages/other/ChatProvider"
import { getSender, getSenderFullDetails } from "../config/chatLogics"
import ProfileDialog from "../dialog/ProfileDialog"
import { useUser } from "../hooks/useUser"
import Eye from "../icons/Eye"
import UpdateGroupChatModal from "../dialog/UpdateGroupChatModal"
import Send from "../icons/Send"
import { toast } from "sonner"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import Spinner from "../loaders/Spinner"
import ChatMessages from "./ChatMessages"

interface IChatsProps {
    fetchAgain: boolean,
    setFetchAgain: (e: boolean) => void
}

const ChatBox = ({fetchAgain, setFetchAgain}: IChatsProps) => {
    const [messages, setMessages] = useState<any>([])
    const [newMessage, setNewMessage] = useState("")
    const { selectedChat } = useChat()
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user } = useUser()

    const fetchMessages = async () => {
        if(!selectedChat) return;
        setLoading(true)

        try {
            const response = await axios.get(`${BACKEND_URL}/message/${selectedChat._id}`, {
                withCredentials: true
            })
            // console.log(response.data.messages)
            setMessages(response.data.messages)
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

    useEffect(() => {
        fetchMessages()
    }, [selectedChat])

    const handleSendMessage = async (e?: React.KeyboardEvent | React.MouseEvent) => {
        e?.preventDefault()

        if(!newMessage.trim()){
            toast.warning("Please enter a message")
        }
        // console.log(e)

        try {
            setNewMessage("")
            const response = await axios.post(`${BACKEND_URL}/message`, {
                chatId: selectedChat?._id,
                message: newMessage
            }, {
                withCredentials: true
            })
            // console.log(response.data.newMessage)
            setMessages((prevMessages: any) => [...prevMessages, response.data.newMessage])
        } catch (err) {
            const errorMessage = axios.isAxiosError(err)
            ? err.response?.data?.message || err.message
            : "Something went wrong";
            
            console.log("Error sending message: ", err)
            toast.error(errorMessage)
        }
    }

    const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value)

        // Typing Indicator logic
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
                            <ChatMessages messages={messages} />
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