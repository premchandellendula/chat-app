import { useState, type ChangeEvent } from "react"
import Heading from "../../components/ui/Heading"
import InputBox from "../../components/ui/InputBox"
import PasswordInputBox from "../../components/ui/PasswordInputBox"
import Button from "../../components/ui/Button"
import BottomWarning from "../../components/ui/BottomWarning"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import FileInput from "../../components/ui/FileInput"
import { useUser } from "../../components/hooks/useUser"


const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        imageUrl: ""
    })

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const navigate = useNavigate();
    const { login } = useUser()

    const canSubmit =
        formData.name.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.password.trim() !== "" &&
        formData.confirmPassword.trim() !== "" &&
        formData.password === formData.confirmPassword;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if(name === "confirmPassword"){
            if(value !== formData.password){
                setConfirmPasswordError("Passwords do not match")
            }else{
                setConfirmPasswordError("")
            }
        }

        if (name === "password" && formData.confirmPassword.length > 0) {
            if (formData.confirmPassword !== value) {
                setConfirmPasswordError("Passwords do not match");
            } else {
                setConfirmPasswordError("");
            }
        }
    }

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true)

        try{
            await axios.post(`${BACKEND_URL}/auth/signup`, formData, {
                withCredentials: true
            })

            await login()

            toast.success("Signup successful")

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

    const postDetails = async (pics: any) => {
        if(!pics){
            toast.warning("Please select an image");
            return;
        }

        if(pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData()
            data.append("file", pics)
            data.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
            data.append("cloud_name", import.meta.env.VITE_CLOUD_NAME)

            try{
                const response = await axios.post(import.meta.env.VITE_API_BASE_URL, data)
                console.log(response)
                const imageUrl = response.data.secure_url;

                setFormData(prev => ({
                    ...prev,
                    imageUrl: imageUrl,
                }));
            }catch(err){
                toast.error("Image upload failed");
                console.error(err);
            }
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="flex justify-center items-center h-screen">
                    <div className="px-6 py-4 w-96 rounded-md border border-gray-200 shadow-lg">
                        <Heading label="Create your account" />

                        <InputBox label="Full Name" type="text" name="name" id="name" placeholder="John Doe" onChange={handleChange} />

                        <InputBox label="Email" type="email" name="email" id="email" placeholder="johndoe@gmail.com" onChange={handleChange} />

                        <PasswordInputBox label="Password" name="password" id="password" placeholder="123456" onChange={handleChange}  />

                        <PasswordInputBox label="Confirm Password" name="confirmPassword" id="confirmPassword" placeholder="123456" onChange={handleChange} />

                        <FileInput label="ProfilePicture" name="imageUrl" id="imageUrl" onChange={(e) => postDetails(e.target.files?.[0])} />

                        {error && <p className="text-red-500">{error}</p>}

                        {confirmPasswordError && <p className="text-red-500">{confirmPasswordError}</p>}

                        <Button type="submit" text="Signup" variant="primary" size="sm" width="full" loading={loading} disabled={!canSubmit || loading} />
                        <BottomWarning label="Already have an account?" buttonText="Sign in" to={'/signin'} />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Signup