import React, {FC, useState} from 'react'

interface Props {
    type : string
    onChange : (value : string) => void
    label: string
    value: string
}

export const InputField : FC<Props> = ({type, onChange, label, value}) => {
    let [text, setText] = useState<string>("");
    return (
        <section>
            <section>{label}</section>
            <input type={type} onChange={(e) => setText(e.target.value)}/>
        </section>
    )
}