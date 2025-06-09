import { useState } from "react"
import { useUser } from "../../pages/other/UserProvider"
import Flyout from "./Flyout"

const Profile = () => {
    const { user } = useUser()
    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false)

    return (
        <div className="dark:text-white rounded-full relative cursor-pointer">
            <img src={user?.imageUrl} alt="" width={28} height={28} className="rounded-full h-7 object-cover" onClick={() => setIsFlyoutOpen(!isFlyoutOpen)} />

            {isFlyoutOpen && <Flyout setIsFlyoutOpen={setIsFlyoutOpen} />}
        </div>
    )
}

export default Profile