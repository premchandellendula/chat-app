import { FiEye } from "react-icons/fi"

const Eye = ({onClick}: {onClick: () => void}) => {
    return (
        <div>
            <FiEye className="text-lg cursor-pointer" onClick={onClick} />
        </div>
    )
}

export default Eye