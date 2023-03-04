import React, { useRef, useState } from 'react';
import Logo from '../img/pin-green.png';
import { GrFormClose } from 'react-icons/gr';
import '../style/register.css';
import { Alert } from '@mui/material';
import axios from 'axios';

const Register = ({ closeRegister }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [alertClose, setAlertClose] = useState(true);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handlerSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    nameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';

    try {
      await axios.post('/users/register', newUser);
      setSuccess(true);
      setError(false);
    } catch (error) {
      setError(true);
    }
  };

  return (
    <div>
      <>
        {success && (
          <Alert severity="success" className="alert" onClose={() => {}}>
            Register successfull, you can login now!
          </Alert>
        )}
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
        <form className="register" onSubmit={handlerSubmit}>
          <GrFormClose
            className="btnCloseModal"
            onClick={() => closeRegister(false)}
          />
          <div className="titleForm">
            <img src={Logo} alt="maps" />
            <p>ROAMING ROADS</p>
          </div>
          <div className="form_register">
            <label>Username</label>
            <input type="text" ref={nameRef} />
          </div>
          <div className="form_register">
            <label>Email</label>
            <input type="email" ref={emailRef} />
          </div>
          <div className="form_register">
            <label>Password</label>
            <input type="password" ref={passwordRef} />
          </div>
          <button className="registerAccBtn" type="submit">
            Register
          </button>
        </form>
      </>
    </div>
  );
};

export default Register;
