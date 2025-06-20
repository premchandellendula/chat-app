import { createContext, useContext, useState } from "react";
import type { UserType } from "../../config";

interface Chat {
    _id: string;
    users: UserType[];
    latestMessage?: string;
    isGroupChat: boolean,
    chatName: string
    groupAdmin: UserType
}

type SelectedChat = Chat | null;

interface ChatContextType {
    selectedChat: SelectedChat;
    setSelectedChat: React.Dispatch<React.SetStateAction<SelectedChat>>;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    notification: Chat[],
    setNotification: React.Dispatch<React.SetStateAction<Chat[]>>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: {children: React.ReactNode}) => {
    const [selectedChat, setSelectedChat] = useState<SelectedChat>(null)
    const [chats, setChats] = useState<Chat[]>([])
    const [notification, setNotification] = useState<Chat[]>([])

    return (
        <ChatContext.Provider value={{ selectedChat, setSelectedChat, chats, setChats, notification, setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatProvider

export const useChat = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
};