import { makeAutoObservable } from "mobx";

export interface User {
    login: string
    user_id: string
    tasks : number[]
    tg_id: string
}

class UserData {
    constructor(){
        makeAutoObservable(this)
    }

    public user : User | undefined=undefined
    
    setUserData(data : any) {
        this.user = data
    }

    updateUserData(partialData: Partial<User>) {
        if (this.user) {
            this.user = {
                ...this.user,
                ...partialData
            }
        }
    }
}

let userData = new UserData();

export {userData}