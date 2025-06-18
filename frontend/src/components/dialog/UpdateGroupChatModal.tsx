import { useState } from "react"
import { BACKEND_URL, type UserType } from "../../config"
import { useChat } from "../../pages/other/ChatProvider"
import { useUser } from "../hooks/useUser"
import Cross from "../icons/Cross"
import UserBadge from "../other/UserBadge"
import Input from "../ui/Input"
import axios from "axios"
import { toast } from "sonner"
import Spinner from "../loaders/Spinner"
import UserListItem from "../other/UserListItem"
import { handleSearch } from "../config/chatLogics"

interface IUpdateGroupChatModalProps {
    fetchAgain: boolean,
    setFetchAgain: (val: boolean) => void
    isGroupChatModalOpen: boolean
    setIsGroupChatModalOpen: (val: boolean) => void
}

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, isGroupChatModalOpen, setIsGroupChatModalOpen}: IUpdateGroupChatModalProps) => {
    const [groupChatName, setGroupChatName] = useState("")
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])

    const { selectedChat, setSelectedChat } = useChat()
    const { user } = useUser()
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const handleRename = async () => {
        if(!groupChatName){
            return
        }
        setRenameLoading(true)
        try {
            const response = await axios.put(`${BACKEND_URL}/chat/group`, {
                chatId: selectedChat?._id,
                chatName: groupChatName
            }, {
                withCredentials: true
            })

            setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
            toast.success("Updated the group name")
        } catch (err) {
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error renaming the chat: ", err)
            toast.error(errorMessage)
            setRenameLoading(false)
        }finally{
            setRenameLoading(false)
        }

        setGroupChatName("")
    }

    const handleAddUser = async (userToAdd: UserType) => {
        if(selectedChat?.users.find((user: UserType | null) => user?._id === userToAdd._id)){
            toast.warning("User already exists")
        }

        if(selectedChat?.groupAdmin._id !== user?._id){
            toast.error("Only Admins can add")
        }

        try {
            const response = await axios.put(`${BACKEND_URL}/chat/addusertogroup`, {
                user_id: userToAdd._id,
                chatId: selectedChat?._id
            }, {
                withCredentials: true
            })

            setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
        } catch (err) {
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error adding user to the chat: ", err)
            toast.error(errorMessage)
        }
    }

    const handleRemove = async (userToRemove: UserType | null) => {
        if(selectedChat?.groupAdmin._id !== user?._id && userToRemove?._id !== user?._id){
            toast.error("Only admins can remove")
        }
        setLoading(true)
        try{
            const response = await axios.put(`${BACKEND_URL}/chat/removeuserfromgroup`, {
                chatId: selectedChat?._id,
                user_id: userToRemove?._id
            }, {
                withCredentials: true
            })

            userToRemove?._id === user?._id ? setSelectedChat(null) : setSelectedChat(response.data.groupChat)
            setFetchAgain(!fetchAgain)
        }catch(err){
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error remover user from the chat: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 min-h-screen w-full flex justify-center items-center z-50 bg-black/80">
            <div className="bg-white w-80 flex flex-col rounded-md p-6">
                <div className="flex justify-between">
                    <h2>{selectedChat?.chatName}</h2>
                    <Cross onClick={() => { 
                        setIsGroupChatModalOpen(!isGroupChatModalOpen)
                        document.body.style.overflow = 'unset'
                    }} />
                </div>

                <div>
                    <div className="flex flex-wrap gap-1 mt-4">
                        {selectedChat?.users.map((user: UserType) => (
                            <UserBadge key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                        ))}
                    </div>

                    <form className="flex justify-center items-center gap-2 mt-2" onSubmit={handleRename}>
                        <Input type="text" name="renamegroup" id="renamegroup" placeholder="Rename group" onChange={(e) => setGroupChatName(e.target.value)} />

                        <button type="submit" className="bg-green-500 cursor-pointer text-white rounded-md px-2 py-1">
                            {renameLoading ? (
                                <Spinner />
                            ) : (
                                "Update"
                            )}
                        </button>
                    </form>

                    <form className=" mt-2">
                        <Input type="text" name="users" id="users" placeholder="Enter Users" onChange={(e) => {
                            handleSearch(e.target.value, search, setSearch, setSearchResult)
                        }} />

                    </form>

                    {search.length > 0 ? (
                        searchResult.slice(0,4).map((user: any) => (
                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                        ))
                    ) : (
                        <span className="text-gray-300 text-center">loading</span>
                    )}

                    <div className="flex justify-end mt-2">
                        <button onClick={() => handleRemove(user)} type="submit" className="bg-red-500 text-white px-2 py-1 rounded-md">
                            {loading ? (
                                <Spinner />
                            ) : (
                                "Leave Group"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateGroupChatModal