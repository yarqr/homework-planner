import React, {FC, useState} from 'react'
import "./InputField.css"

interface Props {
    type : string
    onChange : (value : string) => void
    label: string
    value: string
}

export const InputField : FC<Props> = ({type, onChange, label, value}) => {
    return (
        <section className="input-container">
            <label className="input-label">{label}</label>
            <input 
            className="input-field"
            type={type} 
            onChange={(e) => onChange(e.target.value)}
            value={value}
            />
    </section>
    )
}