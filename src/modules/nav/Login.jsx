import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import { Link, useNavigate } from "react-router-dom";
import './Login.css'

//Module to generate a login form. The content reacts when the users is logged to display a welcome message and the logout button. 
const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { user, setUser } = useUserContext();
    const [updateStatus, setUpadteStatus] = useState("");
    const [passwordType, setPassworodType] = useState("password");
    const loginURL = "http://localhost:3000/api/artists/login"

    const sendLogin = async (data) => {
        4
        if (data) {
            const payload = {
                email: data.email,
                password: data.password
            };

            try {
                const response = await axios.post(loginURL, payload);
                const userData = response.data;

                localStorage.setItem("token", userData.token);

                const userResponse = await axios.get(`http://localhost:3000/api/artists/${userData.userId}/`);
                const newUser = userResponse.data;
                setUser(newUser);
                navigate("/");
            } catch (err) {
                setUpadteStatus(err.response.data.estado);
            };
        };
    };

    const logOut = () => {
        localStorage.removeItem("token");
        setUser({});
        navigate("/");
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

    const logPage = (
        <>
            <form className="login--logForm" onSubmit={handleSubmit((data) => sendLogin(data))}>
                <div className="login--formInputWrap">
                    <input {...register("email", { required: { value: true, message: "Se debe introducir el email." } })} id="userEmail" type="text" placeholder={"email"}></input>
                    {errors.email?.message && <p className="login--errorMessage">{errors.email.message}</p>}
                    <div className="login--passwordWrap">
                        <input autoComplete="new-password" {...register("password", { required: { value: true, message: "Se debe introducir la contraseña." } })} id="userPass" type={passwordType} placeholder={"contraseña"}></input>
                        <span className="login--eyeWrap">
                            <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}  onClick={() => managePasswordType()} />
                        </span>
                    </div>
                    {errors.password?.message && <p className="login--errorMessage">{errors.password.message}</p>}
                </div>
                <button className="login--submit" type="submit">Iniciar sesion</button>
            </form>
            {updateStatus && <p className="login--statusMessage">{updateStatus}</p>}
        </>
    );

    return (
        <>
            {logPage}
        </>
    );
};

export default Login;