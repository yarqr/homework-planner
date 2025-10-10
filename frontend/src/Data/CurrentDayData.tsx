import { makeAutoObservable } from "mobx";

export interface Task {
    date : Date
    name : string
    id : string
}

class TasksData {
    constructor(){
        makeAutoObservable(this)
    }

    public tasks : Task[] | undefined=undefined
    
    setTasksData(data : any) {
        this.tasks = data
    }
}

let tasksData = new TasksData()

export {tasksData}