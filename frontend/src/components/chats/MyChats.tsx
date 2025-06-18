import { useEffect, useState } from "react"
import Plus from "../icons/Plus"
import SearchBar from "../search/SearchBar"
import SearchResultModal from "../dialog/SearchResultModal"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useChat } from "../../pages/other/ChatProvider"
import { toast } from "sonner"
import GroupChatModal from "../dialog/GroupChatModal"
import { getSender } from "../config/chatLogics"
import { useUser } from "../hooks/useUser"

const MyChats = ({fetchAgain}: {fetchAgain: boolean}) => {
    const [searchResults, setSearchResults] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)
    const { selectedChat, setSelectedChat, chats, setChats } = useChat()
    const { user } = useUser()

    const handleUserSelect = async (userId: string) => {
        try {
            const response = await axios.post(`${BACKEND_URL}/chat/`, {
                user_id: userId
            }, {
                withCredentials: true
            })

            if(!chats.find((c) => c._id === response.data.chat._id)){
                setChats([response.data.chats, ...chats])
            }
            setSelectedChat(response.data.chat)
            setIsModalOpen(false)
        } catch (err) {
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error creating or fetching chat: ", err)
            toast.error(errorMessage)
        }
    }

    const fetchChats = async () => {
        try{
            const response = await axios.get(`${BACKEND_URL}/chat`, {
                withCredentials: true
            })
            console.log(response.data.chats)
            setChats(response.data.chats)
        }catch(err){
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error fetching chats: ", err)
            toast.error(errorMessage)
        }
    }

    useEffect(() => {
        fetchChats()
    }, [fetchAgain])

    return (
        <div className="w-[35%] relative">
            <div className="flex justify-between py-2 px-4">
                <p className="font-semibold text-[1.1rem] dark:text-white">Chats</p>
                <Plus onClick={() => setIsGroupChatModalOpen(true)} />
            </div>
            <div className="px-2">
                <SearchBar
                onResults={(users) => setSearchResults(users)}
                openModal={() => setIsModalOpen(true)} />
            </div>

            {chats.length === 0 ? (
                <p className="text-gray-500">No chats found.</p>
            ) : (
                <ul className="flex flex-col gap-3 mt-2">
                    {chats.map((chat: any) => (
                        <li
                        key={chat._id}
                        onClick={() => setSelectedChat(chat)}
                        className={`cursor-pointer p-1 rounded-md mx-2 hover:bg-gray-300/60 dark:hover:bg-gray-800 dark:text-white ${selectedChat === chat ? "bg-green-500" : "bg-gray-200/80"}`}>
                            <div className="flex items-center gap-3">
                                {!chat.isGroupChat ? (
                                    <>
                                        <img src={chat.users[0].imageUrl} alt={chat.users[0].name} className="w-10 h-10 rounded-full object-cover" />
                                        <span>{getSender(user, chat.users)}</span>
                                    </>
                                ) : (
                                    <>
                                        <img src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="group image" className="rounded-full w-10 h-10 object-cover" />
                                        <span className="h-10 flex items-center">{chat.chatName}</span>
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isGroupChatModalOpen && <GroupChatModal setIsGroupChatModalOpen={setIsGroupChatModalOpen} isGroupChatModalOpen={isGroupChatModalOpen} />}

            {isModalOpen && <SearchResultModal users={searchResults} onClose={() => setIsModalOpen(false)} onUserSelect={handleUserSelect} />}
        </div>
    )
}

export default MyChats