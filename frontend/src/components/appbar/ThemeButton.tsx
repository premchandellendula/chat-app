import { LuMoon, LuSun } from "react-icons/lu"
import { useTheme } from "../../pages/other/ThemeProvider"

const ThemeButton = () => {
    const { theme, lightTheme, darkTheme } = useTheme()
    
    const onChangeBtn = () => {
        if(theme === "light"){
            darkTheme()
        }

        if(theme === "dark"){
            lightTheme()
        }
    }
    return (
        <button onClick={onChangeBtn} className="relative h-7 w-7 flex items-center justify-center rounded-full cursor-pointer">
            <LuSun
                className="absolute h-5 w-5 text-yellow-500 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0"
            />
            
            <LuMoon 
                className="absolute h-5 w-5 text-gray-800 dark:text-gray-400 transition-all duration-300 rotate-90 scale-0 dark:-rotate-0 dark:scale-100"
            />
        </button>
    )
}

export default ThemeButton