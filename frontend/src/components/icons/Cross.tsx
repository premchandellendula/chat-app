import { RxCross2 } from "react-icons/rx"

interface ICross {
    onClick: () => void
}

const Cross = ({onClick}: ICross) => {
    return (
        <div onClick={onClick} className="text-lg dark:text-gray-300">
            <RxCross2 />
        </div>
    )
}

export default Cross