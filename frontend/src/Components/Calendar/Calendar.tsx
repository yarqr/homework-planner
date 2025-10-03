import React, { FC, useState, useEffect } from "react";
import './Calendar.css';

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

export const Calendar = () => {
    const monthNames = Object.values(MonthNames)
    const weekDays = Object.values(WeekDays)

    let [currentDate, setDate] = useState(new Date())
    let [contextMenuElem, setContextMenuElem] = useState<CalendarDay | null>(null)
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
            <button className="switcher" onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>&lt;</button>
            <button className="switcher" onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>&gt;</button>
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
              <section>меню</section>
              <section>{contextMenuElem.date?.getDate()}.{contextMenuElem.date!.getMonth() + 1}.{contextMenuElem.date!.getFullYear()}</section>
              <button onClick={() => {setContextMenuElem(null)}}>закрыть</button>
            </section>
          }
        </section>
    );
};