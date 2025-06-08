import type { ChangeEvent } from "react"

interface IInputBox {
    name: string,
    id: string,
    label: string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FileInput = (props: IInputBox) => {
    return (
        <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-sm font-semibold">{props.label}</label>
            <input 
                onChange={props.onChange} 
                type="file"
                name={props.name} 
                id={props.id}
                accept="image/*" 
                className="p-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-100/80 outline-none" 
            />
        </div>
    )
}

export default FileInput