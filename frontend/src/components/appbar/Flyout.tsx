import { useEffect, useRef, useState } from "react";
import UserIcon from "../icons/UserIcon";
import Logout from "../icons/Logout";
import ProfileDialog from "../dialog/ProfileDialog";
import { useUser } from "../hooks/useUser";

interface IFlyout {
    setIsFlyoutOpen: (value: boolean) => void
}

const Flyout = (props: IFlyout) => {
    const { user, logout } = useUser()
    const ref = useRef<HTMLDivElement>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleClickOutside = (event: MouseEvent) => {
        if(ref.current && !ref.current.contains(event.target as Node)){
            props.setIsFlyoutOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])
    return (
        <div ref={ref} className="absolute right-0 top-12 bg-white shadow-md text-black rounded-md w-32 py-2 px-3 z-50 flex flex-col gap-y-1">
            <div 
                onClick={() => {
                    setIsDialogOpen(!isDialogOpen)
                    document.body.style.overflow = 'hidden'
                }} 
                className="flex items-center justify-center gap-2 hover:bg-green-100/60 rounded-md p-2">
                <UserIcon />
                <span className="text-lg">Profile</span>
            </div>
            <div onClick={() => logout()} className="flex items-center justify-center gap-2 hover:bg-green-100/60 rounded-md p-2">
                <Logout />
                <span className="text-lg">Logout</span>
            </div>

            {isDialogOpen && <ProfileDialog user={user} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />}
        </div>
    )
}

export default Flyout