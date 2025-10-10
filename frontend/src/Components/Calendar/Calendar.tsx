import React, { FC, useState, useEffect } from "react";
import './Calendar.css';
import { SwitcherButton } from "../../UI/SwitcherButton/SwitcherButton";
import { InputField } from "../../UI/InputField/InputField";
import { Props } from "../AuthWindow/AuthWindow";
import { useNavigate } from "react-router";
import { observer } from "mobx-react-lite";
import { userData } from "../../Data/UserData";
import axios from "axios";
import { ApiEndpoints } from "../../Service/axiosService";
import { tasksData } from "../../Data/CurrentDayData";

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

export const Calendar : FC<Props> = observer(({navigateFunction}) => {
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
        date : new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        tasksNum: userData.user?.tasks.
        filter((x, index) => index + 1 == currentDate.getDay()).
        reduce((acc, el) => acc += el)
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

    const sendTask = async () => {
      console.log(currentDate.toISOString())
      try {
        let response = await axios.post(ApiEndpoints.tasks.create(), {
          name : newTask,
          date : currentDate.toISOString(),
          user_id: userData.user?.user_id
        })
        console.log(response)
      } catch (error) {
        console.log(error)
      }
    }


    const openContextMenu = async (el : CalendarDay) => {
      setContextMenuElem(el)
      try {
        let response = await axios.get(ApiEndpoints.tasks.get(
          userData.user!.user_id, 
          currentDate.toISOString(),
        ))
        tasksData.setTasksData(response.data)
        console.log(response)
      } catch (e) {
        console.log(e)
      }
    }

    useEffect(() => {
      const getTasksNum = async() => {
        try {
          let response = await axios.get(ApiEndpoints.tasks.getMonth(userData.user!.user_id))
          userData.user!.tasks = response.data
          console.log(response)
        } catch(e){
          console.log(e)
        }
      }
      getTasksNum();
    }, [])

    return (
      <section>
        <nav>
          <button onClick={navigateFunction}>выход</button>
          <section>{userData.user?.login}</section>
        </nav>
        <section className="main">
          <section className="calendar">
            <div className="date-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
            <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} text="&lt;"/>
            <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} text="&gt;"/>
            <section className="container">
              {weekDays.map(el => <div className="day-header">{el}</div>)}
              {currMonthDays.map(el => <div onClick={() => openContextMenu(el)} className={el.date != null ? "day-card" : "day-card-disabled"}>
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
              <section>{tasksData.tasks?.map(el => <section>{el.name}</section>)}</section>
              <InputField type="text" onChange={(value) => {setNewTask(value)}} label="Добавить задачу" value={newTask} regex={/$^/}/>
              <button className="btn2" onClick={() => sendTask()}>Добавить</button>
              <button className="btn" onClick={() => {setContextMenuElem(null)}}>закрыть</button>
            </section>
          }
        </section>
      </section>
    );
});