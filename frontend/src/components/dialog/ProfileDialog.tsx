import type { UserType } from "../../config"
import Cross from "../icons/Cross"

interface IProfileDialog {
    setIsDialogOpen: (val: boolean) => void
    isDialogOpen: boolean
    user: UserType | null
}

const ProfileDialog = ({user, isDialogOpen, setIsDialogOpen} : IProfileDialog) => {
    return (
        <div className="fixed inset-0 min-h-screen w-full flex justify-center items-center z-50 bg-black/80">
            <div className="bg-white dark:bg-gray-900 w-72 flex flex-col rounded-md p-6">
                <div className="flex justify-end">
                    <Cross onClick={() => { 
                            setIsDialogOpen(!isDialogOpen)
                            document.body.style.overflow = 'unset'
                        }} />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <img src={user?.imageUrl} alt="" width={120} height={220} className="rounded-full h-30 object-cover" />
                    <p className="text-xl font-semibold dark:text-gray-100">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileDialog