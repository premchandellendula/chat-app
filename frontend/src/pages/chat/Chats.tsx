import { useState } from "react"
import Appbar from "../../components/appbar/Appbar"
import ChatBox from "../../components/chats/ChatBox"
import MyChats from "../../components/chats/MyChats"

const Chats = () => {
    const [fetchAgain, setFetchAgain] = useState(false)
    return (
        <div className="dark:bg-[#0a0b1b] h-screen flex flex-col">
            <Appbar />

            <div className="flex flex-1 overflow-hidden">
                <MyChats fetchAgain={fetchAgain} />
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
        </div>
    )
}

export default Chats