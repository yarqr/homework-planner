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

export const Calendar = () => {
    
    let date = new Date();
    let [currMonth, setMonth] = useState(date.getMonth() + 1);
    let monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    let monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)
    let currMonthDays = [];

    for (let i = monthStart.getDate(); i <= monthEnd.getDate(); i++) {
      let day = {
        date : new Date(date.getFullYear(), date.getMonth(), i)
      }
      currMonthDays.push(day)
    }

    return (
        <>
          <div>{currMonth}</div>
          {currMonthDays.map(el => <div>{el.date.getDate()}</div>)}
        </>
    );
};
