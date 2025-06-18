import type { UserType } from "../../config"

const UserListItem = ({user, handleFunction}: {user: UserType, handleFunction: () => void}) => {
    return (
        <li
        onClick={handleFunction}
        className={`cursor-pointer p-1 rounded-md  hover:bg-gray-300/60 dark:hover:bg-gray-800 dark:text-white list-none m-0.5`}>
        <div className="flex items-center gap-3">
            <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex flex-col">
                <span className="text-[0.8rem] text-gray-600">{user.name}</span>            
                <span className="text-[0.8rem] text-gray-600">{user.email}</span>
            </div>
        </div>
        </li>
    )
}

export default UserListItem