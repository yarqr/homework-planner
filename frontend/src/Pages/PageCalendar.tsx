import React, {FC, useState} from "react";
import { Calendar } from "../Components/Calendar/Calendar";
import { useNavigate } from "react-router";
import { Navigation } from "../UI/Navigation/Navigation";
import { Context } from "../Components/Context/Context";
import { CalendarDay } from "../Components/Calendar/Types";
import { observer } from "mobx-react-lite";
import "../App.css"

export const PageCalendar : FC = observer(() => {
    let navigate = useNavigate()
    const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null)
    const [currentDate, setCurrentDate] = useState(new Date())

    const handleNavigate = () => {
        navigate("/")
    }

    const handleDayClick = (day: CalendarDay) => {
        setSelectedDay(day)
    }

    const handleCloseContext = () => {
        setSelectedDay(null)
    }

    const handleTaskUpdate = () => {
        setCurrentDate(new Date())
    }

    return (
        <>
            <Navigation navigateFunc={handleNavigate}/>
            <section className="main">
                <Calendar 
                    navigateFunction={handleNavigate} 
                    onDayClick={handleDayClick}
                />
                <Context 
                    selectedDay={selectedDay}
                    currentDate={currentDate}
                    onClose={handleCloseContext}
                    onTaskUpdate={handleTaskUpdate}
                />
            </section>
        </>
    )
})