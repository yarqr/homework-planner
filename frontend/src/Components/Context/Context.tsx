import React, {useState, FC, useEffect} from "react";
import { tasksData } from "../../Data/CurrentDayData";
import { DeleteButton } from "../../UI/DeleteButton/DeleteButton";
import { InputField } from "../../UI/InputField/InputField";
import { userData } from "../../Data/UserData";
import axios from "axios";
import { ApiEndpoints } from "../../Service/axiosService";
import { CalendarDay } from "../Calendar/Types";
import "./Context.css"

interface ContextProps {
  selectedDay: CalendarDay | null;
  currentDate: Date;
  onClose: () => void;
  onTaskUpdate: () => void;
}

export const Context : FC<ContextProps> = ({ selectedDay, currentDate, onClose, onTaskUpdate }) => {
    let [newTask, setNewTask] = useState<string>("")

    useEffect(() => {
        if (selectedDay?.date) {
            openContextMenu(selectedDay);
        }
    }, [selectedDay]);

    const sendTask = async () => {
        try {
          const taskDate = new Date(selectedDay!.date!);
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
          
          if (selectedDay?.date) {
            openContextMenu(selectedDay)
          }
          setNewTask("")
          onTaskUpdate();
        } catch (error) {
          console.log(error)
        }
    }

    const openContextMenu = async (el: CalendarDay) => {
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
          
          if (selectedDay?.date) {
            openContextMenu(selectedDay)
          }
          onTaskUpdate();
        } catch (error) {
          console.log(error)
        }
    }

    if (!selectedDay || !selectedDay.date) {
        return null;
    }

    return (
        <section className="context">
            <section className="context-header">меню</section>
            <section className="context-date">{selectedDay.date?.getDate()}.{selectedDay.date!.getMonth() + 1}.{selectedDay.date!.getFullYear()}</section>
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
            <button className="btn" onClick={onClose}>закрыть</button>
        </section>
    )
}