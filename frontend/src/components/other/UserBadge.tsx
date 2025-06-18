import type { UserType } from "../../config"

const UserBadge = ({user, handleFunction}: {user: UserType, handleFunction: () => void}) => {
    return (
        <div className="bg-purple-500 px-2 py-0.5 rounded-lg w-fit flex justify-center text-white items-center gap-2">
            <span onClick={handleFunction} className=" text-[0.8rem] ">{user.name}</span>
            <span className="text-[0.7rem] mt-0.5 cursor-pointer" onClick={handleFunction} >&#x2715;</span>
        </div>
    )
}

export default UserBadge