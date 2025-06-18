import { useState } from "react"
import { useChat } from "../../pages/other/ChatProvider"
import { getSender, getSenderFullDetails } from "../config/chatLogics"
import ProfileDialog from "../dialog/ProfileDialog"
import { useUser } from "../hooks/useUser"
import Eye from "../icons/Eye"
import UpdateGroupChatModal from "../dialog/UpdateGroupChatModal"

interface IChatsProps {
    fetchAgain: boolean,
    setFetchAgain: (e: boolean) => void
}

const ChatBox = ({fetchAgain, setFetchAgain}: IChatsProps) => {
    const { selectedChat, setSelectedChat } = useChat()
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
    const [isGroupChatModalOpen, setIsGroupChatModalOpen] = useState(false)

    const { user } = useUser()
    return (
        <div className="w-[65%] dark:bg-[#0a0b1b] h-auto flex justify-center border-l border-gray-300">
            {selectedChat ? (
                <>
                    <div className="w-full">
                        <h2>
                            {!selectedChat.isGroupChat ? (
                                <div className="text-xl flex justify-between items-center w-full px-4">
                                    {getSender(user, selectedChat.users)}
                                    <Eye onClick={() => setIsProfileDialogOpen(!isProfileDialogOpen)} />
                                </div>

                            ): (
                                <div className="text-lg flex justify-between items-center w-full px-4">
                                    {selectedChat.chatName}
                                    <Eye onClick={() => setIsGroupChatModalOpen(!isGroupChatModalOpen)} />
                                </div>
                            )}
                        </h2>
                        
                        {isProfileDialogOpen && <ProfileDialog user={getSenderFullDetails(user, selectedChat.users)} isDialogOpen={isProfileDialogOpen} setIsDialogOpen={setIsProfileDialogOpen} />}

                        {isGroupChatModalOpen && <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} isGroupChatModalOpen={isGroupChatModalOpen} setIsGroupChatModalOpen={setIsGroupChatModalOpen} />}

                    </div>
                </>
            ): (
                <div className="flex justify-center items-center text-2xl font-semibold">
                    Click on a user to start chatting
                </div>
            )}
        </div>
    )
}

export default ChatBox