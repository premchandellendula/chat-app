import { Link } from "react-router-dom"

interface IBottomWarning {
    label: string,
    buttonText: string,
    to: string
}

const BottomWarning = (props: IBottomWarning) => {
    return (
        <div className='flex justify-center pt-2 text-[0.8rem] md:text-[0.95rem]'>
                <div className='text-gray-600'>
                    {props.label}
                </div>
                <Link to={props.to} className='pointer underline pl-1 cursor-pointer text-[0.8rem] md:text-[0.95rem] text-gray-800'>{props.buttonText}</Link>
            </div>
    )
}

export default BottomWarning