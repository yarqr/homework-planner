import React, { FC, useState, useEffect } from "react";
import './Calendar.css';
import { SwitcherButton } from "../../UI/SwitcherButton/SwitcherButton";
import { InputField } from "../../UI/InputField/InputField";
import { n } from "react-router/dist/development/index-react-server-client-BYr9g50r";

interface CalendarDay {
  date: Date | null;
}

enum MonthNames {
  JAN = "январь",
  FEB = "февраль",
  MAR = "март",
  APR = "апрель",
  MAY = "май",
  JUN = "июнь",
  JUL = "июль",
  AUG = "август",
  SEP = "сентябрь",
  OCT = "октябрь",
  NOV = "ноябрь",
  DEC = "декабрь"
}

enum WeekDays {
  MON = "понедельник",
  TUE = "вторник",
  WED = "среда",
  THU = "четверг",
  FRI = "пятница",
  SAT = "суббота",
  SUN = "воскресенье"
}

export const Calendar : FC = () => {
    const monthNames = Object.values(MonthNames)
    const weekDays = Object.values(WeekDays)
    
    let [currentDate, setDate] = useState(new Date())
    let [contextMenuElem, setContextMenuElem] = useState<CalendarDay | null>(null)
    let [newTask, setNewTask] = useState<string>("")
    let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    let monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    let currMonthDays: CalendarDay[] = [];

    let startDay = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;

    for (let i = monthStart.getDate(); i <= monthEnd.getDate(); i++) {
      let day = {
        date : new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      }
      currMonthDays.push(day)
    }

    for (let i = 0; i < startDay; i++) {
      currMonthDays.unshift({date : null})
    }

    let endDay = monthEnd.getDay() === 0 ? 0 : 7 - monthEnd.getDay();

    for (let i = 0; i < endDay; i++) {
      currMonthDays.push({date : null})
    }

    return (
        <section className="main">
          <section className="calendar">
            <div className="date-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
            <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} text="&lt;"/>
            <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} text="&gt;"/>
            <section className="container">
              {weekDays.map(el => <div className="day-header">{el}</div>)}
              {currMonthDays.map(el => <div onClick={() => setContextMenuElem(el)} className={el.date != null ? "day-card" : "day-card-disabled"}>
                {el.date != null &&
                <>
                  <section>{el.date?.getDate()}</section>
                </>
                }
                </div>)}
            </section>
          </section>
          {contextMenuElem && 
            <section className="context">
              <section className="context-header">меню</section>
              <section className="context-date">{contextMenuElem.date?.getDate()}.{contextMenuElem.date!.getMonth() + 1}.{contextMenuElem.date!.getFullYear()}</section>
              <InputField type="text" onChange={(value) => {setNewTask(value)}} label="Добавить задачу" value={newTask} regex={/$^/}/>
              <button className="btn2" onClick={() => console.log(newTask)}>Добавить</button>
              <button className="btn" onClick={() => {setContextMenuElem(null)}}>закрыть</button>
            </section>
          }
        </section>
    );
};