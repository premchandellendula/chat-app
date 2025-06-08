import Spinner from "../loaders/Spinner";

interface IButton {
    variant: "primary" | "secondary",
    size: "sm" | "md" | "lg" | "xl";
    type: "submit" | "reset" | "button" | undefined,
    text: string,
    width: "auto" | "full",
    loading?: boolean,
    disabled?: boolean,
    onClick?: () => void
}

const variantStyles = {
    "primary": "bg-green-600 text-green-100 hover:bg-green-600/90",
    "secondary": "bg-green-300 text-green-500 hover:bg-green-300/90"
}

const sizeVariants = {
    "sm": "px-3.5 py-1",
    "md": "px-3.5 py-1.5",
    "lg": "md:px-4.5 px-3.5 md:py-2 py-1.5",
    "xl": "px-5 py-2",
}

const widthVariants = {
    "auto": "w-auto",
    "full": "w-full mt-4 m-auto"
}

const Button = ({ loading = false, ...props}: IButton) => {
    return (
        <button 
            onClick={props.onClick}
            type={props.type}
            className={`flex justify-center items-center gap-2 ${widthVariants[props.width]} ${sizeVariants[props.size]} ${variantStyles[props.variant]} text-base rounded-lg cursor-pointer ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            { loading ? <Spinner /> : props.text }
        </button>
    )
}

export default Button