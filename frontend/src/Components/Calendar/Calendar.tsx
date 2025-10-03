import React, { FC, useState, useEffect } from "react";
import './Calendar.css';

interface CalendarDay {
  date: number;
  isCurrent: boolean;
  fullDate?: Date;
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
    let monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    let monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    let currMonthDays = [];

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

    let endDay = monthEnd.getDay();
    let adjustedEndDay = endDay === 0 ? 0 : 7 - endDay;

    for (let i = 0; i < adjustedEndDay; i++) {
      currMonthDays.push({date : null})
    }

    return (
        <>
          <div>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
          <button onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>назад</button>
          <button onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>вперед</button>
          <section className="container">
            {weekDays.map(el => <div>{el}</div>)}
            {currMonthDays.map(el => <div className="day-card">{el.date != null ? el.date?.getDate() : "-"}</div>)}
          </section>
        </>
    );
};