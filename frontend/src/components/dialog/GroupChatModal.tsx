import { useState } from "react"
import Cross from "../icons/Cross"
import { useChat } from "../../pages/other/ChatProvider"
import Input from "../ui/Input"
import Spinner from "../loaders/Spinner"
import { toast } from "sonner"
import axios from "axios"
import { BACKEND_URL, type UserType } from "../../config"
import UserBadge from "../other/UserBadge"
import UserListItem from "../other/UserListItem"
import { handleSearch } from "../config/chatLogics"

interface IGroupChatModalProps {
    setIsGroupChatModalOpen: (val: boolean) => void
    isGroupChatModalOpen: boolean
}

const GroupChatModal = ({setIsGroupChatModalOpen, isGroupChatModalOpen}: IGroupChatModalProps) => {

const [groupChatName, setGroupChatName] = useState("")
const [selectedUsers, setSelectedUsers] = useState<UserType[]>([])
const [search, setSearch] = useState("")
const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { chats, setChats } = useChat() 

    const handleSubmit = async () => {
        setLoading(true)
        if(!groupChatName || !selectedUsers){
            toast.warning("Fields are missing")
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/chat/group`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map(u => u._id)),
            }, {
                withCredentials: true
            })
            setChats([response.data.groupChat, ...chats])
            setIsGroupChatModalOpen(!isGroupChatModalOpen)
            toast.success("Group created successfully")
        } catch (err) {
            let errorMessage = "Something went wrong"

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error fetching chats: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    const handleGroup = (userToAdd: UserType) => {
        if(!userToAdd){
            toast.warning("Select a user")
        }
        if(selectedUsers.includes(userToAdd)){
            toast.warning("User already added")
        }else{
            setSelectedUsers([...selectedUsers, userToAdd])
        }
    }

    const handleDelete = (userToDelete: UserType) => {
        setSelectedUsers(selectedUsers.filter(user => user._id !== userToDelete._id))
    }

    return (
        <div className="fixed inset-0 min-h-screen w-full flex justify-center items-center z-50 bg-black/80">
            <div className="bg-white w-80 flex flex-col rounded-md p-6">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">New Group</span>
                    <Cross onClick={() => { 
                            setIsGroupChatModalOpen(!isGroupChatModalOpen)
                            document.body.style.overflow = 'unset'
                        }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <Input type="text" name="users" id="groupname" placeholder="Enter a Name" onChange={(e) => {
                            setGroupChatName(e.target.value)
                        }} />

                        <Input type="text" name="users" id="users" placeholder="Enter Users" onChange={(e) => {
                            handleSearch(e.target.value, search, setSearch, setSearchResult)
                        }} />
                    </div>

                    <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((user: UserType) => (
                            <UserBadge key={user._id} user={user} handleFunction={() => handleDelete(user)} />
                        ))}
                    </div>
                    
                    <div className="flex justify-end ">
                        <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded-md">
                            {loading ? (
                                <Spinner />
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </div>
                </form>

                {search.length > 0 ? (
                    searchResult.slice(0,4).map((user: any) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                ) : (
                    <span className="text-gray-300 text-center">loading</span>
                )}
            </div>
        </div>
    )
}

export default GroupChatModal