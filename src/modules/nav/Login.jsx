import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import { Link, useNavigate } from "react-router-dom";
import Register from "./register";
import './Login.css'

//Module to generate a login form. The content reacts when the users is logged to display a welcome message and the logout button. 
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const [updateStatus, setUpadteStatus] = useState("");
    const [passwordType, setPassworodType] = useState("password");
    const [loginType, setLoginType] = useState(false);
    const [registerWindow, setRegisterWindow] = useState(false);

    const sendLogin = async (data) => {
        const apiArtistURL = "http://localhost:3000/api/artists/";
        const apiClientURL = "http://localhost:3000/api/clients/";

        if (data) {
            const payload = {
                email: data.email,
                password: data.password
            };

            try {
                let response = "";

                if (loginType) {
                    response = await axios.post(apiArtistURL + "login", payload);
                } else {
                    response = await axios.post(apiClientURL + "login", payload);
                }

                const userData = response.data;

                localStorage.setItem("token", userData.token);

                let userResponse = "";

                if (loginType) {
                    userResponse = await axios.get(apiArtistURL + userData.userId + "/");
                } else {
                    userResponse = await axios.get(apiClientURL + userData.userId + "/");
                }

                const newUser = userResponse.data;
                setUser(newUser);
                navigate("/");
            } catch (err) {
                setUpadteStatus(err.response.data.estado);
            };
        };
    };

    const managePasswordType = () => {
        let newType = "";

        if (passwordType === "password") {
            newType = "text";
            setPassworodType(newType);
        } else {
            newType = "password";
            setPassworodType(newType);
        }
    }

    const handleToggle = () => {
        setLoginType(!loginType);
    }

    const logPage = () => {
        return (
            <>
                <form className="login__logForm" onSubmit={handleSubmit((data) => sendLogin(data))}>
                    <div className="login__formInputWrap">
                        <input {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} id="userEmail" type="text" placeholder={"email"}></input>
                        {errors.email?.message && <p className="login--errorMessage">{errors.email.message}</p>}
                        <div className="login--passwordWrap">
                            <input autoComplete="new-password" {...register("password", { required: { value: true, message: "Se debe introducir la contraseña." } })} id="userPass" type={passwordType} placeholder={"contraseña"}></input>
                            <span className="login--eyeWrap">
                                <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePasswordType()} />
                            </span>
                        </div>
                        <label className="switch">
                            <input type="checkbox" onClick={() => handleToggle()} />
                            <span className="slider round"></span>
                        </label>
                        {loginType ? <p>Artist</p> : <p>Client</p>}
                        {errors.password?.message && <p className="login--errorMessage">{errors.password.message}</p>}
                        <button className="login__submit" type="submit">Iniciar sesion</button>
                        {updateStatus && <p className="login--statusMessage">{updateStatus}</p>}
                        <p onClick={() => setRegisterWindow(true)}>Don't have an account? Register here!</p>
                        {registerWindow && <Register/>}
                    </div>
                </form>
            </>
        );
    };

    return (
        <>
            {registerWindow ? <Register/> : logPage()}
        </>
    );
};

export default Login;