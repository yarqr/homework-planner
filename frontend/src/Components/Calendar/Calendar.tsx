import React, { FC, useState, useEffect } from "react";
import './Calendar.css';
import { SwitcherButton } from "../../UI/SwitcherButton/SwitcherButton";
import { Props } from "../AuthWindow/AuthWindow";
import { observer } from "mobx-react-lite";
import { userData } from "../../Data/UserData";
import axios from "axios";
import { ApiEndpoints } from "../../Service/axiosService";
import { CalendarDay, MonthNames, WeekDays } from "./Types";

interface CalendarProps {
  navigateFunction: () => void;
  onDayClick: (day: CalendarDay) => void;
}

export const Calendar: FC<CalendarProps> = observer(({ navigateFunction, onDayClick }) => {
  const monthNames = Object.values(MonthNames)
  const weekDays = Object.values(WeekDays)

  let [currentDate, setDate] = useState(new Date())
  let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  let monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  let currMonthDays: CalendarDay[] = [];

  let startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;
  
  for (let i = monthStart.getDate(); i <= monthEnd.getDate(); i++) {
    let taskCount = 0;
    
    if (userData.user?.tasks && userData.user.tasks[i - 1] !== undefined) {
      taskCount = userData.user.tasks[i - 1];
    }

    let day = {
      date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
      tasksNum: taskCount
    }
    currMonthDays.push(day)
  }
  for (let i = 0; i < startDay; i++) {
    currMonthDays.unshift({ date: null })
  }

  let endDay = monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay();

  for (let i = 0; i < endDay; i++) {
    currMonthDays.push({ date: null })
  }

  useEffect(() => {
    const getTasksNum = async () => {
      try {
        let date = currentDate ?? new Date();
        let response = await axios.get(ApiEndpoints.tasks.getMonth(userData.user!.user_id,
          date.getFullYear(),
          date.getMonth() + 1))
        userData.user!.tasks = response.data.result
      } catch (e) {
        console.log(e)
      }
    }
    getTasksNum();
  }, [currentDate])

  return (
    <section className="main">
      <section className="calendar">
        <div className="date-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
        <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} text="←" />
        <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} text="→" />
        <section className="container">
          {weekDays.map((el, index) => <div key={index} className="day-header">{el}</div>)}
          {currMonthDays.map((el, index) => (
            <div 
                key={index} 
                onClick={() => el.date && onDayClick(el)} 
                className={el.date != null ? "day-card" : "day-card-disabled"}
              >
                {el.date != null &&
                  <>
                    <section>{el.date?.getDate()}</section>
                    {el.tasksNum !== undefined && el.tasksNum > 0 && (
                      <section className="task-badge">{el.tasksNum}</section>
                    )}
                  </>
                }
              </div>
          ))}
        </section>
      </section>
    </section>
  );
});