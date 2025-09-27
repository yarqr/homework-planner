import React, {FC, useState} from 'react'

interface Props {
    type : string
    onChange : () => void
}

export const InputField : FC<Props> = ({type, onChange}) => {
    let [text, setText] = useState<string>("");
    return (
        <input type={type} onChange={(e) => setText(e.target.value)}/>
    )
}