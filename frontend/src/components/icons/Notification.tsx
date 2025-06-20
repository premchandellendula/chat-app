import { IoMdNotificationsOutline } from "react-icons/io"
import { useChat } from "../../pages/other/ChatProvider"
import { useEffect, useState } from "react";

const Notification = ({onClick}: {onClick: () => void}) => {
    const { notification } = useChat();
    const [shouldPulse, setShouldPulse] = useState(false)
    const [prevCount, setPrevCount] = useState(0)
    
    useEffect(() => {
        if(notification.length > prevCount && prevCount >= 0){
            setShouldPulse(true)
            const timer = setTimeout(() => setShouldPulse(false), 2000)
            return () => clearTimeout(timer)
        }
        
        setPrevCount(notification.length)
    }, [notification.length, prevCount])

    return (
        <button className={`relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer`} onClick={onClick}>
            <IoMdNotificationsOutline className="h-5 w-5 text-gray-700 dark:text-gray-200" /> 
            {notification.length > 0 && (
                <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 ${
                    shouldPulse ? 'animate-ping' : ''
                }`}>
                    {notification.length > 9 ? '9+' : notification.length === 0 ? '' : notification.length}
                </span>
            )}
        </button>
    )
}

export default Notification