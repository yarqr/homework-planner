import React, {FC, useState} from "react";
import { InputField } from "../../UI/InputField/InputField";
import axios, { AxiosError } from "axios";
import "./AuthWindow.css"
import { ApiEndpoints } from "../../Service/axiosService";
import {userData} from "../../Data/UserData";

export interface Props {
    navigateFunction: () => void
}

export const AuthWindow: FC<Props> = ({navigateFunction}) => {
    const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [regFormOpen, setRegFormOpen] = useState<boolean>(false);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
  };

  const sendAuth = async() => {
    try {
      let response = await axios.post(regFormOpen ? ApiEndpoints.auth.register() : ApiEndpoints.auth.login(), 
        {login : username, password : password})
      userData.setUserData(response.data)
      navigateFunction();
      console.log(response)
    } catch (error : AxiosError | any) {
      window.alert(error.message)
    }
  }

  const loginForm = () => {
    return (
      <>
        <InputField
          type="text"
          label="Введите имя пользователя"
          value={username}
          onChange={handleUsernameChange}
          regex={/[^A-Za-z0-9_@$]/g}
        />
        <InputField
          type="password"
          label="Введите пароль"
          value={password}
          onChange={handlePasswordChange}
          regex={/[^A-Za-z0-9_@$]/g}
        />
      </>
    );
  };

  const regForm = () => {
    return (
      <>
        <InputField
          type="text"
          label="Введите имя пользователя"
          value={username}
          onChange={handleUsernameChange}
          regex={/[^A-Za-z0-9_@$]/g}
        />
        <InputField
          type="password"
          label="Введите пароль"
          value={password}
          onChange={handlePasswordChange}
          regex={/[^A-Za-z0-9_@$]/g}
        />
        <InputField
          type="password"
          label="Подтвердите пароль"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          regex={/[^A-Za-z0-9_@$]/g}
        />
      </>
    );
  };

  return (
    <section className="auth-container">
      <h2 className="auth-title">
        {!regFormOpen ? 'Вход в систему' : 'Регистрация'}
      </h2>
      {!regFormOpen ? loginForm() : regForm()}
      <div className="button-container">
        <button className="primary-button" onClick={() => sendAuth()}>
          {!regFormOpen ? 'войти' : 'зарегистрироваться'}
        </button>
        <button className="secondary-button" onClick={() => setRegFormOpen(!regFormOpen)}>
          {regFormOpen ? 'назад к входу' : 'зарегистрироваться'}
        </button>
      </div>
    </section>
  );
}