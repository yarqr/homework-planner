import React from "react";
import { useNavigate } from "react-router";
import { AuthWindow } from "../Components/AuthWindow";

export const PageAuth = () => {
    let navigate = useNavigate()
    return (
        <section>
            <AuthWindow navigateFunction={() => navigate("/calendar")}/>
        </section>
    )
}