import React, {FC} from "react";
import "./SwitcherButton.css"

interface Props {
    onClick : () => void,
    text: string
}

export const SwitcherButton : FC<Props> = ({onClick, text}) => {
    return (
        <button className="switcher" onClick={onClick}>
            {text}
        </button>
    )
}