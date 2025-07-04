// src/hooks/useUser.ts
import { useContext } from "react"
import { UserContext } from "../../pages/other/UserProvider";

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
}
