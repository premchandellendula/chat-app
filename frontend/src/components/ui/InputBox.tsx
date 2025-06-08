import type { ChangeEvent } from "react"

interface IInputBox {
    type: string,
    name: string,
    id: string,
    label: string,
    placeholder?: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputBox = (props: IInputBox) => {
    return (
        <div className="flex flex-col gap-1.5 mt-2">
            <div className="flex">
                <label className="text-sm font-semibold">{props.label}</label>
                <span className="ml-1 text-red-600">*</span>
            </div>
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

export default InputBox