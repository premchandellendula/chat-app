import { useState, type ChangeEvent } from "react"
import BottomWarning from "../../components/ui/BottomWarning"
import Button from "../../components/ui/Button"
import Heading from "../../components/ui/Heading"
import InputBox from "../../components/ui/InputBox"
import PasswordInputBox from "../../components/ui/PasswordInputBox"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useUser } from "../other/UserProvider"

const Signin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { login } = useUser()

    const canSubmit = formData.email.trim() !== "" && formData.password.trim() !== "";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)

        try{
            await axios.post(`${BACKEND_URL}/auth/signin`, formData, {
                withCredentials: true
            })
            await login()

            toast.success("Signin successful")

            if(formData.email && formData.password){
                navigate('/chats')
            }
        }catch(err){
            let errorMessage = "Something went wrong";

            if (axios.isAxiosError(err)) {
                errorMessage = err.response?.data?.message || err.message;
            }
            console.log("Error signing up: ", err)
            setError(errorMessage);
            setLoading(false)
        }finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center h-screen">
                    <div className="p-6 w-96 rounded-md border border-gray-200 shadow-lg">
                        <Heading label="Sign in to your account" />
                        <InputBox label="Email" type="email" name="email" id="email" placeholder="johndoe@gmail.com" onChange={handleChange} />
                        <PasswordInputBox label="Password" name="password" id="password" placeholder="123abc" onChange={handleChange} />
                        {error && <p className="text-red-500">{error}</p>}
                        <Button text="Signin" variant="primary" size="sm" type="submit" width="full" loading={loading} disabled={!canSubmit || loading} />
                        <BottomWarning label={"Don't have an account?"} buttonText="Sign up" to="/signup" />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Signin