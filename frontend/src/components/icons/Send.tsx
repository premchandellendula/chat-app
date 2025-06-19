import { LuSend } from "react-icons/lu"

const Send = ({onClick}: {onClick: (e: any) => void}) => {
    return (
        <button onClick={onClick} className="absolute right-5 top-5 cursor-pointer">
            <LuSend size={"22px"} className="hover:text-green-600 text-gray-400" /> 
        </button>
    )
}

export default Send