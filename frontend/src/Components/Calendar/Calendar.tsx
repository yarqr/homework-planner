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
import { DeleteButton } from "../../UI/DeleteButton/DeleteButton";
import { telegramLink } from "../../Service/telegram";

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
  let [tgWinOpened, setTgWinOpened] = useState<boolean>(false)
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

  const openWindow = async() => {
    setTgWinOpened(!tgWinOpened)
    const get = async() => {
      const response = await axios.get(ApiEndpoints.auth.get(userData.user!.user_id))
      userData.updateUserData({
        login: response.data.login,
        tg_id: response.data.tg_id
      })
    }
    get()
    
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
    const get = async() => {
      const response = await axios.get(ApiEndpoints.auth.get(userData.user!.user_id))
      userData.updateUserData({
        login: response.data.login,
        tg_id: response.data.tg_id
      })
    }
    getTasksNum();
    get()
  }, [currentDate])

  return (
    <section>
      <nav>
        <button className="navbtn" onClick={navigateFunction}>выход</button>
        <section>{userData.user?.login}</section>
        <button className="nav-tg" onClick={() => openWindow()}>
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
          </svg>
        </button>
      </nav>
      <section className="main">
        {tgWinOpened && <section className="window">
          <section>статус: {userData.user?.tg_id != undefined ? "✅ Подключено" : "❌ Отключено"}</section>
          <section>Нажмите ниже, чтобы привязать аккаунт в телеграм и получать уведомления</section>
          <a href={telegramLink.link(userData.user!.user_id)} onClick={() => setTgWinOpened(false)} target="_blank">перейти в бота</a>
        </section>}
        <section className="calendar">
          <div className="date-header">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</div>
          <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} text="←" />
          <SwitcherButton onClick={() => setDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} text="→" />
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
                  <DeleteButton func={() => delTask(el.id)}/>
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