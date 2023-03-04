import React, { useRef, useState } from 'react';
import Logo from '../img/pin-green.png';
import { GrFormClose } from 'react-icons/gr';
import { Alert } from '@mui/material';
import axios from 'axios';
import '../style/login.css';

const Login = ({ closeLogin, storage, currentUser }) => {
  const [error, setError] = useState(false);
  const [alertClose, setAlertClose] = useState(true);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const login = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post('/users/login', login);
      storage.setItem('user', res.data.username);
      currentUser(res.data.username);
      closeLogin(false);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <>
      {error && alertClose && (
        <Alert
          severity="error"
          className="alert"
          onClose={() => setAlertClose(false)}
        >
          Oops, something went wrong!
        </Alert>
      )}
      <div className="wrapper"></div>
      <form className="login" onSubmit={handlerSubmit}>
        <GrFormClose
          className="btnCloseModal"
          onClick={() => closeLogin(false)}
        />
        <div className="titleForm">
          <img src={Logo} alt="maps" />
          <p>ROAMING ROADS</p>
        </div>
        <div className="form_login">
          <label>Username</label>
          <input type="text" ref={nameRef} />
        </div>
        <div className="form_login">
          <label>Password</label>
          <input type="password" ref={passwordRef} />
        </div>
        <button className="loginAccBtn" type="submit">
          Login
        </button>
      </form>
    </>
  );
};

export default Login;
