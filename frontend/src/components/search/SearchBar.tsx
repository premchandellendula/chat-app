import axios from "axios"
import { useState } from "react"
import { toast } from "sonner"
import { BACKEND_URL } from "../../config"

interface SearchBarProps {
    onResults: (users: any) => void;
    openModal: () => void;
}

const SearchBar = ({ onResults, openModal }: SearchBarProps) => {
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSearch = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        if(!name){
            toast.warning("Please enter a name!")
        }

        try{
            const response = await axios.get(`${BACKEND_URL}/search/users?search=${name}`, {
                withCredentials: true
            })

            onResults(response.data.users);
            openModal();
        }catch(err){
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error signing up: ", err)
            toast.error(errorMessage)
            setLoading(false)
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center rounded-md relative w-full bg-gray-200/60 text-gray-800 shadow-inner dark:bg-gray-950 dark:text-gray-200 dark:shadow-md">
            <input onChange={(e) => setName(e.target.value)} type="text" className="rounded-md px-4 md:py-2 py-1 w-full bg-transparent focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-200/70 dark:focus:ring-gray-800" placeholder="Search Users" />
            <span 
            onClick={handleSearch}
            className="absolute right-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="md:size-10 size-9 text-gray-500 dark:text-gray-400 p-2 rounded-r-md flex items-center justify-center cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </span>
        </div>
    )
}

export default SearchBar