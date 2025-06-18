import { LuPlus } from "react-icons/lu"

const Plus = ({onClick}: {onClick: () => void}) => {
    return (
        <div onClick={onClick}>
            <LuPlus size={"20"} className="dark:text-white" />
        </div>
    )
}

export default Plus