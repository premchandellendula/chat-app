import type { ChangeEvent } from "react"

interface IInput {
    type: string,
    name: string,
    id: string,
    placeholder: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: IInput) => {
    return (
        <div className="flex flex-col gap-1.5">
        <input 
            onChange={props.onChange} 
            type={props.type} 
            name={props.name} 
            id={props.id} 
            placeholder={props.placeholder} 
            className="p-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-100/80 outline-none" 
        />
    </div>
    )
}

export default Input