import { useState } from "react";
import axios from "axios";
import './Register.css'

//Module to generate a login form. The content reacts when the users is logged to display a welcome message and the logout button. 
const Register = ({ sendToParent }) => {
    //Fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [passwordType, setPassworodType] = useState("password");
    const [repeatPasswordType, setRepeatPassworodType] = useState("password");
    //Fields State
    const [emailState, setEmailState] = useState("");
    const [passwordState, setPasswordState] = useState([]);
    const [repeatPasswordState, setRepeatPasswordState] = useState("");
    const [nameState, setNameState] = useState("");
    const [nickState, setNickState] = useState("");
    const [registerState, setRegisterState] = useState("");

    const [registerType, setRegisterType] = useState(false);
    const apiArtistURL = "http://localhost:3000/api/artists/register";
    const apiClientURL = "http://localhost:3000/api/clients/register";

    //Function to check the correlation on the passwords. As simple as it gets. Outputs a message if not valid.
    const checkPasswords = () => {
        if (password !== repeatPassword) {
            setRepeatPasswordState("No coinciden las contraseñas");
        } else {
            setRepeatPasswordState("");
        };
    };

    //Function to check the email input. Uses array of error messages and regex validators to check and reply on each case.
    const checkEmailFormat = () => {
        const emailCheckList = [
            "Tiene que tener al menos 6 caracteres",
            "No es un formato correcto de email"
        ];

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[@]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(email);

            if (!isValid) {
                actualCheckList.push(emailCheckList[i])
            }
        })

        setEmailState(actualCheckList);
    };

    //Function to check the password strength. Uses array of error messages and regex validators to check and reply on each case.
    const checkPassSecurity = () => {
        const passwordChecklist = [
            "Tiene que tener al menos 6 caracteres",
            "Debe incluir al menos 1 numero",
            "Debe incluir al menos 1 letra minuscula",
            "Debe incluir al menos 1 letra mayuscula",
            "Deve incluir al menos 1 caracter especial"
        ]

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[0-9]/ },
            { regex: /[a-z]/ },
            { regex: /[A-Z]/ },
            { regex: /[^A-Za-z0-9]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(password);

            if (!isValid) {
                actualCheckList.push(passwordChecklist[i])
            }
        })

        setPasswordState(actualCheckList);
    };

    //Function to check the name input. Uses array of error messages and regex validators to check and reply on each case.
    const checkNameFormat = () => {
        const nameCheckList = [
            "Tiene que tener al menos 3 caracteres",
            "Debe incluir al menos 1 letra minuscula"
        ]

        const validationRegex = [
            { regex: /.{3,}/ },
            { regex: /[a-z]/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(name);

            if (!isValid) {
                actualCheckList.push(nameCheckList[i])
            }
        })

        setNameState(actualCheckList);
    }

    //Function to check the nick input. Uses array of error messages and regex validators to check and reply on each case.
    const checkNickFormat = () => {
        const nickCheckList = [
            "El campo no puede estar vacio"
        ]

        const validationRegex = [
            { regex: /.{1,}/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(nick);

            if (!isValid) {
                actualCheckList.push(nickCheckList[i])
            }
        })

        setNickState(actualCheckList);
    };

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const register = async (e) => {
        e.preventDefault();

        setEmailState([]);
        setPasswordState([]);
        setNameState([]);
        setNickState([]);

        checkEmailFormat();
        checkPassSecurity();
        checkNameFormat();
        checkNickFormat();
        checkPasswords();

        if (emailState.length === 0 && passwordState.length === 0 && repeatPasswordState.length === 0 && nameState.length === 0 && nickState.length === 0
            && email && password && name && nick) {
            const payload = {
                email,
                password,
                name,
                nick
            }

            try {
                let response = "";

                if (registerType) {
                    response = await axios.post(apiArtistURL, payload);
                } else {
                    response = await axios.post(apiClientURL, payload);
                }

                const registerStatus = response.data.estado;
                setRegisterState(registerStatus);
            } catch (error) {
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

    const manageRepeatPasswordType = () => {
        let newType = "";

        if (repeatPasswordType === "password") {
            newType = "text";
            setRepeatPassworodType(newType);
        } else {
            newType = "password";
            setRepeatPassworodType(newType);
        }
    };

    const handleToggle = () => {
        setRegisterType(!registerType);
    };

    const handleClick = () => {
        sendToParent(false);
    };


    return (
        <div className="register__registerForm">
            <h2 className="register--tittle">Formulario de registro</h2>
            <h4 className="register--info">No podras iniciar sesión hasta que la cuenta sea aprobada por un administrador</h4>
            {!registerState ?
                <form className="register--form" onSubmit={register}>
                    <div className="register--formPair">
                        <label htmlFor="newuserEmail">Email</label>
                        <input id="newuserEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    {emailState &&
                        <ul>
                            {emailState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="newuserPass">Contraseña</label>
                        <div className="register--passwordWrap">
                            <input id="newuserPass" autocomplete="new-password" type={passwordType} value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <span className="register--eyeWrap">
                                <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePasswordType()} />
                            </span>
                        </div>
                    </div>
                    {passwordState &&
                        <ul>
                            {passwordState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="repeatNewUserPass">Repite la contraseña</label>
                        <div className="register--passwordWrap">
                            <input id="repeatNewUserPass" autocomplete="new-password" type={repeatPasswordType} value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)}></input>
                            <span className="register--eyeWrap">
                                <i className={repeatPasswordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => manageRepeatPasswordType()} />
                            </span>
                        </div>
                    </div>
                    {repeatPasswordState && <p className="register--formError">{repeatPasswordState}</p>}
                    <div className="register--formPair">
                        <label htmlFor="newuserName">Name</label>
                        <input id="newuserName" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    {nameState &&
                        <ul>
                            {nameState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="newuserNick">Nick</label>
                        <input id="newuserNick" type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                    </div>
                    {nickState &&
                        <ul>
                            {nickState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <label className="switch">
                        <input type="checkbox" onClick={() => handleToggle()} />
                        <span className="slider round"></span>
                    </label>
                    {registerType ? <p>Artist</p> : <p>Client</p>}
                    <button className="register--formButton" type="submit">Registrarse</button>
                </form>
                :
                <p>{registerState}</p>}
            <button onClick={handleClick}>Cancel</button>
        </div>
    )
};

export default Register;