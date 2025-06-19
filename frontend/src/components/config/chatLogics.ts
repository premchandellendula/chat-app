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

export const isSameSender = (messages: any, m: any, i: any, userId: any) => {
    return (
        i < messages.length - 1 && (
            messages[i + 1].userId._id !== m.userId._id || messages[i + 1].userId._id === undefined) && messages[i].userId._id !== userId
    )
}

export const isLastMessage = (messages: any, i: any, userId: any) => {
    return (
        i === messages.length - 1 && messages[messages.length - 1].userId._id !== userId && messages[messages.length - 1].userId._id
    )
}

export const isSameSenderMargin = (messages: any, m: any, i: any, userId: any) => {
    if(
        i < messages.length - 1 && messages[i + 1].userId._id === m.userId._id && messages[i].userId._id !== userId
    ){
        return 33
    }else if(
        (i < messages.length - 1 && messages[i + 1].userId._id !== m.userId._id && messages[i].userId._id !== userId) || (i === messages.length - 1 && messages[i].userId._id !== userId)
    ){
        return 0
    }else{
        return "auto"
    }
}

export const isSameUser = (messages: any, m: any, i: any) => {
    return i > 0 && messages[i-1].userId._id === m.userId._id
}