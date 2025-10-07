import { makeAutoObservable } from "mobx";

export interface User {
    login: string
}

class UserData {
    constructor(){
        makeAutoObservable(this)
    }

    public user : User | undefined=undefined
    
    setUserData(data : any) {
        this.user = data
    }
}

let userData = new UserData();

export {userData}