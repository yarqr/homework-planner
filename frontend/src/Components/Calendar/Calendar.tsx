import React, { FC, useState, useEffect } from "react";
import './Calendar.css';
import { SwitcherButton } from "../../UI/SwitcherButton/SwitcherButton";
import { InputField } from "../../UI/InputField/InputField";
import { Props } from "../AuthWindow/AuthWindow";
import { observer } from "mobx-react-lite";
import { userData } from "../../Data/UserData";
import axios from "axios";
import { ApiEndpoints } from "../../Service/axiosService";
import { tasksData } from "../../Data/CurrentDayData";

interface CalendarDay {
  date: Date | null;
  tasksNum? : number
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

export const Calendar: FC<Props> = observer(({ navigateFunction }) => {
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

  const sendTask = async () => {
    try {
      const taskDate = new Date(contextMenuElem!.date!);
      taskDate.setDate(taskDate.getDate() + 1);
      
      let response = await axios.post(ApiEndpoints.tasks.create(), {
        name: newTask,
        date: taskDate.toISOString().split('T')[0],
        user_id: userData.user?.user_id
      })
      console.log(response)
      
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
      await getTasksNum();
      
      if (contextMenuElem?.date) {
        openContextMenu(contextMenuElem)
      }
      setNewTask("")
    } catch (error) {
      console.log(error)
    }
  }

  const delTask = async (id: string) => {
    try {
      let response = await axios.delete(ApiEndpoints.tasks.delete(id))
      console.log(response)
      
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
      await getTasksNum();
      
      if (contextMenuElem?.date) {
        openContextMenu(contextMenuElem)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openContextMenu = async (el: CalendarDay) => {
    setContextMenuElem(el)
    try {
      const taskDate = new Date(el!.date!);
      taskDate.setDate(taskDate.getDate() + 1);
      
      let response = await axios.get(ApiEndpoints.tasks.get(
        userData.user!.user_id,
        taskDate.toISOString().split('T')[0],
      ))
      tasksData.setTasksData(response.data)
    } catch (e) {
      console.log(e)
    }
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
    <section>
      <nav>
        <button onClick={navigateFunction}>выход</button>
        <section>{userData.user?.login}</section>
      </nav>
      <section className="main">
        <section className="calendar">
          <div className="date-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
          <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} text="&lt;" />
          <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} text="&gt;" />
          <section className="container">
            {weekDays.map((el, index) => <div key={index} className="day-header">{el}</div>)}
            {currMonthDays.map((el, index) => (
              <div 
                  key={index} 
                  onClick={() => el.date && openContextMenu(el)} 
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
        {contextMenuElem &&
          <section className="context">
            <section className="context-header">меню</section>
            <section className="context-date">{contextMenuElem.date?.getDate()}.{contextMenuElem.date!.getMonth() + 1}.{contextMenuElem.date!.getFullYear()}</section>
            <section>
              {(tasksData.tasks || []).map(el => (
                <section key={el.id} className="task">
                  <section>{el.name}</section>
                  <button onClick={() => delTask(el.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bin" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </section>
              ))}
            </section>
            <InputField type="text" onChange={(value) => { setNewTask(value) }} label="Добавить задачу" value={newTask} regex={/$^/} />
            <button className="btn2" onClick={() => sendTask()}>Добавить</button>
            <button className="btn" onClick={() => { setContextMenuElem(null) }}>закрыть</button>
          </section>
        }
      </section>
    </section>
  );
});