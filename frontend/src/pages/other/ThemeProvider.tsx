import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type ThemeContextType = {
    theme: string;
    darkTheme: () => void;
    lightTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    darkTheme: () => {},
    lightTheme: () => {}
})

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeProvider = ({children} : ThemeProviderProps) => {
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light")

    const lightTheme = () => setTheme("light")
    const darkTheme = () => setTheme("dark")

    useEffect(() => {
        document.querySelector("html")?.classList.remove("dark", "light")
        document.querySelector("html")?.classList.add(theme)
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, lightTheme, darkTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext)