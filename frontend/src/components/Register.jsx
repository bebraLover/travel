import React, {useRef, useState} from 'react';
import './Login.css';
import {Cancel, Room} from "@material-ui/icons";
import axios from "axios";

const Register = ({setShowRegister}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        try {
            await axios.post("/users/register", newUser);
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    }
    return (
        <div className={'login-box'}>
            <div className={'logo'}>
                <Room/>
                Geo Pin
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <input type={'text'} placeholder={'username'} ref={nameRef}/>
                <input type={'email'} placeholder={'email'} ref={emailRef}/>
                <input type={'password'} placeholder={'password'} ref={passwordRef}/>
                <button className={'button login'}>Register</button>
                {success && (<span className={'success'}>Success.You can login now!</span>)}
                {error && (<span className={'error'}>Oops.Something went wrong!</span>)}

            </form>
            <Cancel className={'registerCancel'} onClick={() => setShowRegister(false)}/>
        </div>
    );
};

export default Register;
