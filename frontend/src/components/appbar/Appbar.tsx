import Profile from "./Profile"
import ThemeButton from "./ThemeButton"

const Appbar = () => {
    return (
        <div className="w-full flex p-4 px-6 justify-between border-b border-gray-200 dark:border-gray-900">
            <div className="text-xl font-semibold dark:text-white">
                ChatApp
            </div>
            <div className="flex gap-2">
                <ThemeButton />
                <Profile />
            </div>
        </div>
    )
}

export default Appbar