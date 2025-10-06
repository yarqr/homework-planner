import React, {FC, useState} from "react";
import { InputField } from "../../UI/InputField/InputField";
import axios from "axios";
import "./AuthWindow.css"
import { base, Endpoints } from "../../Service/axiosService";

interface Props {
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
    console.log(username, password);
    let response = await axios.post(base + (regFormOpen ? Endpoints.AUTH_REG : Endpoints.AUTH_LOGIN), 
      {login : username, password : password})
    navigateFunction();
  }

  const loginForm = () => {
    return (
      <>
        <InputField
          type="text"
          label="Введите имя пользователя"
          value={username}
          onChange={handleUsernameChange}
        />
        <InputField
          type="password"
          label="Введите пароль"
          value={password}
          onChange={handlePasswordChange}
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
        />
        <InputField
          type="password"
          label="Введите пароль"
          value={password}
          onChange={handlePasswordChange}
        />
        <InputField
          type="password"
          label="Подтвердите пароль"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
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