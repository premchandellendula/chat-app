import { useState } from "react"
// import { useChat } from "../../pages/other/ChatProvider"
import Notification from "../icons/Notification"
import NotificationFlyout from "./NotificationFlyout"

const Notifications = () => {
    // const { notification, setNotification } = useChat()
    const [isNotifiOpen, setIsNotifiOpen] = useState(false)

    return (
        <div className="flex justify-center items-center">
            <Notification onClick={() => setIsNotifiOpen(!isNotifiOpen)} />

            {isNotifiOpen && <NotificationFlyout setIsNotifiOpen={setIsNotifiOpen} />}
        </div>
    )
}

export default Notifications