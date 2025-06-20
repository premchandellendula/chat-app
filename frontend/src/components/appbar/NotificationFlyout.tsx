import { useEffect, useRef } from "react";
import { useChat } from "../../pages/other/ChatProvider";
import { getSender } from "../config/chatLogics";
import { useUser } from "../hooks/useUser";

interface INotificationFlyout {
    setIsNotifiOpen: (value: boolean) => void
}

const NotificationFlyout = ({setIsNotifiOpen}: INotificationFlyout) => {
    const ref = useRef<HTMLDivElement>(null);
    const {notification, setNotification} = useChat()
    const { setSelectedChat } = useChat()
    const { user } = useUser()

    const handleClickOutside = (event: MouseEvent) => {
        if(ref.current && !ref.current.contains(event.target as Node)){
            setIsNotifiOpen(false)
        }
    }
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleNotificationClick = (notify: any) => {
        setSelectedChat(notify.chatId)
        setNotification(notification.filter((n) => n !== notify))
        setIsNotifiOpen(false)
    }

    const formatTimeAgo = (timestamp: string) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime())) / (1000 * 60)

        if(diffInMinutes < 1) return "Just now"
        if(diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`
        if(diffInMinutes < 1440) return `${Math.floor(diffInMinutes/60)}h ago`
        return `${Math.floor(diffInMinutes / 1440)}d ago`
    }

    return (
        <div 
        ref={ref} 
        className={`absolute right-24 top-12 bg-white dark:bg-gray-900 shadow- border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300 rounded-lg w-72 max-h-96 overflow-hidden z-50 transition-all duration-300 py-2 px-3 flex flex-col gap-y-1`}>
            
            <div className="max-h-80 overflow-y-auto">
                {!notification.length ? (
                    <div className="flex flex-col items-center justify-center py-2 px-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No New Messages</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                        {notification.map((notify: any, index: number) => (
                            <li
                                key={index}
                                onClick={() => handleNotificationClick(notify)}
                                className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 p-1 relative overflow-hidden"
                            >
                                {/* Hover indicator */}
                                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200"></div>
                                
                                <div className="flex items-start gap-3">
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                                                {notify.chatId.isGroupChat ? notify.chatId.chatName : getSender(user, notify.chatId.users)}
                                            </p>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                                                {formatTimeAgo(notify.createdAt)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                            {notify.chatId.isGroupChat ? 
                                                `New message in group chat` : 
                                                `New message from ${getSender(user, notify.chatId.users)}`
                                            }
                                        </p>

                                        {/* Message preview if available */}
                                        {notify.content && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                "{notify.content}"
                                            </p>
                                        )}
                                    </div>

                                    {/* New indicator */}
                                    <div className="flex-shrink-0">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default NotificationFlyout