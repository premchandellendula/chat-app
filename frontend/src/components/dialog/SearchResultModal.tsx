import type { UserType } from "../../config";

interface SearchResultModalProps {
    users: UserType[],
    onClose: () => void;
    onUserSelect: (userId: string) => void
}

const SearchResultModal = ({ users, onClose, onUserSelect }: SearchResultModalProps) => {
    return (
        <div className="absolute inset-0 bg-white dark:bg-[#0a0b1b] z-50 rounded-md px-2 shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center mb-2 px-2">
                <p className="text-lg dark:text-white">Users</p>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold mb-1">&times;</button>
            </div>

            {users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {users.map((user: UserType) => (
                        <li
                        key={user._id}
                        className="cursor-pointer p-1 rounded-md bg-gray-200/80 hover:bg-gray-300/60 dark:hover:bg-gray-800 dark:text-white"
                        onClick={() => onUserSelect(user._id)}
                        >
                        <div className="flex items-center gap-3">
                            <img src={user.imageUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                            <span>{user.name}</span>
                        </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchResultModal