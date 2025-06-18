import { toast } from "sonner";
import { BACKEND_URL, type UserType } from "../../config";
import axios from "axios";

export const getSender = (loggedUser: UserType | null, users: UserType[]) => {
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderFullDetails = (loggedUser: UserType | null, users: UserType[]) => {
    return users[0]._id === loggedUser?._id ? users[1] : users[0]
}

export const handleSearch = async (query: string, search: string, setSearch: (val: string) => void, setSearchResult: (val: any) => void) => {
    setSearch(query)

    if(!query){
        return;
    }

    try {
        const response = await axios.get(`${BACKEND_URL}/search/users?search=${search}`, {
            withCredentials: true
        })

        setSearchResult(response.data.users)
        console.log(response.data.users)
    } catch (err) {
        let errorMessage = "Something went wrong";

        if (axios.isAxiosError(err)) {
            errorMessage = err.response?.data?.message || err.message;
        }
        console.log("Error fetching users: ", err)
        toast.error(errorMessage)
    }
}