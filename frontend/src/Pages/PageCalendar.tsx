import React, {FC} from "react";
import { Calendar } from "../Components/Calendar/Calendar";
import { useNavigate } from "react-router";

export const PageCalendar : FC = () => {
    let navigate = useNavigate()
    return <>
    <Calendar navigateFunction={() => navigate("/")}/>
    </>
}