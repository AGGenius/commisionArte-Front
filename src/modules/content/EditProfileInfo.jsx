import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import axios from "axios";
//import './Register.css'

//Module to generate a login form. The content reacts when the users is logged to display a welcome message and the logout button. 
const EditProfileInfo = ({ sendToParent }) => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    //Fields
    const [email, setEmail] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [comm_status, setComm_status] = useState("");
    const [sfw_status, setSfw_status] = useState("");
    const [styles, setStyles] = useState("");
    const [telephone, setTelephone] = useState("");
    const [passwordType, setPassworodType] = useState("password");
    const [repeatPasswordType, setRepeatPassworodType] = useState("password");
    const [password, setPassword] = useState("");
    //Fields State
    const [emailState, setEmailState] = useState("");
    const [contactEmailState, setContactEmailState] = useState("");
    const [newPasswordState, setNewPasswordState] = useState("");
    const [repeatNewPasswordState, setRepeatNewPasswordState] = useState("");
    const [nameState, setNameState] = useState("");
    const [nickState, setNickState] = useState("");
    const [stylesState, setStylesState] = useState("");
    const [telephoneState, setTelephoneState] = useState("");
    const [changeDataState, setChangeDataState] = useState("");
    const [passwordState, setPasswordState] = useState("");

    const [registerType, setRegisterType] = useState(false);
    const apiArtistURL = "http://localhost:3000/api/artists/editInfo/";
    const apiClientURL = "http://localhost:3000/api/clients/editInfo/";

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        setActualValues();
    }, [user])

    const setActualValues = () => {
        setEmail(user.email);
        setContactEmail(user.contact_email);
        setName(user.name);
        setNick(user.nick);
        setSfw_status(user.sfw_status);
        setTelephone(user.telephone);

        if (user.acount_type === "artist") {
            setComm_status(user.comm_status);
            setStyles(user.styles);
        }
    }

    //Function to check the correlation on the passwords. As simple as it gets. Outputs a message if not valid.
    const checkPasswords = () => {
        if (newPassword !== repeatNewPassword) {
            setRepeatNewPasswordState("No coinciden las contraseñas");
            return 1;
        } else {
            setRepeatNewPasswordState("");
            return 0;
        };
    };

    //Function to check the email & contat email inputs. Uses array of error messages and regex validators to check and reply on each case.
    const checkEmailFormat = () => {
        const emailCheckList = [
            "Tiene que tener al menos 6 caracteres",
            "No es un formato correcto de email"
        ];

        const validationRegex = [
            { regex: /.{6,}/ },
            { regex: /[@]/ }
        ];

        let actualCheckListForEmail = [];
        let actualCheckListForContactEmail = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(email);

            if (!isValid) {
                actualCheckListForEmail.push(emailCheckList[i])
            }
        })

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(contactEmail);

            if (!isValid) {
                actualCheckListForContactEmail.push(emailCheckList[i])
            }
        })

        setEmailState(actualCheckListForEmail);
        setContactEmailState(actualCheckListForContactEmail);
        const totalErrors = actualCheckListForEmail.length + actualCheckListForContactEmail.length;
        return totalErrors;
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

            let isValid = item.regex.test(newPassword);

            if (!isValid) {
                actualCheckList.push(passwordChecklist[i])
            }
        })

        setNewPasswordState(actualCheckList);
        return actualCheckList.length;
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
        return actualCheckList.length;
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
        return actualCheckList.length;
    };

    //Function to check the nick input. Uses array of error messages and regex validators to check and reply on each case.
    const checkStylesFormat = () => {
        const nickCheckList = [
            "El campo no puede estar vacio"
        ]

        const validationRegex = [
            { regex: /.{1,}/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(styles);

            if (!isValid) {
                actualCheckList.push(nickCheckList[i])
            }
        })

        setStylesState(actualCheckList);
        return actualCheckList.length;
    };

    //Function to check the telephone input. Uses array of error messages and regex validators to check and reply on each case.
    const checkTelephoneFormat = () => {
        const telephoneCheckList = [
            "El campo no puede estar vacio",
            "Debe contener solo numeros"
        ]

        const validationRegex = [
            { regex: /.{1,}/ },
            { regex: /^-?\d+\.?\d*$/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(telephone);

            if (!isValid) {
                actualCheckList.push(telephoneCheckList[i])
            }
        })

        setTelephoneState(actualCheckList);
        return actualCheckList.length;
    };

    //Function to check the nick input. Uses array of error messages and regex validators to check and reply on each case.
    const checkPasswordState = () => {
        const nickCheckList = [
            "Requiere la contraseña actual para su usuario"
        ]

        const validationRegex = [
            { regex: /.{1,}/ }
        ];

        let actualCheckList = [];

        validationRegex.forEach((item, i) => {

            let isValid = item.regex.test(password);

            if (!isValid) {
                actualCheckList.push(nickCheckList[i])
            }
        })

        setPasswordState(actualCheckList);
        return actualCheckList.length;
    };

    const restartChecks = () => {
        setEmailState([]);
        setContactEmailState([]);
        setNewPasswordState([]);
        setNameState([]);
        setNickState([]);
        setTelephoneState([]);
        setPasswordState([]);
        setStylesState([]);
    };

    const doChecks = () => {
        let totalErrors = 0;
        totalErrors +=  checkEmailFormat();
        totalErrors +=  checkNameFormat();
        totalErrors +=  checkNickFormat();
        totalErrors +=  checkTelephoneFormat();
        totalErrors +=  checkPasswordState();

        if (user.acount_type === "artist") {
            totalErrors +=  checkStylesFormat();
        } 
        
        if (newPassword || repeatNewPassword) {
            totalErrors +=  checkPassSecurity() + checkPasswords();
        }

        return totalErrors;
    };


    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const register = async (e) => {
        e.preventDefault();

        restartChecks();
        const totalErrors = doChecks();        

        if (totalErrors === 0) {

            let payload = {}

            if (user.acount_type === "artist") {
                payload = {
                    name,
                    nick,
                    email,
                    password,
                    contactEmail,
                    sfw_status,
                    comm_status,
                    styles,
                    telephone,
                    newPassword
                }
            } else {
                payload = {
                    name,
                    nick,
                    email,
                    password,
                    contactEmail,
                    sfw_status,
                    telephone,
                    newPassword
                }
            }


            try {
                let response = "";

                if (user.acount_type === "artist") {
                    response = await axios.put(apiArtistURL + user.id, payload);
                } else {
                    response = await axios.put(apiClientURL + user.id, payload);
                }

                if (response.data.editedArtist) {
                    const changedUser = response.data.editedArtist;
                    setUser(changedUser);
                } else if (response.data.editedClient) {
                    const changedUser = response.data.editedClient;
                    setUser(changedUser);
                } else {
                    setChangeDataState("Error en el servidor");
                }

                const changeDataStatus = response.data.estado;
                setChangeDataState(changeDataStatus);

            } catch (error) {
            };

            setPassword("");
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
            <h2 className="register--tittle">Cambia los datos que necesites.</h2>
            {!changeDataState ?
                <form className="register--form" onSubmit={register}>
                    <h3>Datos basicos</h3>
                    <div className="register--formPair">
                        <label htmlFor="editUserEmail">Email</label>
                        <input id="editUserEmail" type="text" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    {emailState &&
                        <ul>
                            {emailState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="editUserContactEmail">Email de contacto</label>
                        <input id="editUserContactEmail" type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}></input>
                    </div>
                    {contactEmailState &&
                        <ul>
                            {contactEmailState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="editUserName">Nombre</label>
                        <input id="editUserName" type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    {nameState &&
                        <ul>
                            {nameState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="editUserNick">Alias</label>
                        <input id="editUserNick" type="text" value={nick} onChange={(e) => setNick(e.target.value)}></input>
                    </div>
                    {nickState &&
                        <ul>
                            {nickState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="editUserTelephone">Numero de telefono de contacto</label>
                        <input id="editUserTelephone" type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)}></input>
                    </div>
                    {telephoneState &&
                        <ul>
                            {telephoneState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}

                    <h3>Campos especificos</h3>
                    <div className="register--formPair">
                        <label htmlFor="editUserNSFWfilter">Filtro NSWF</label>
                        <input id="editUserNSFWfilter" type="checkbox" value={sfw_status ? true : false} checked={sfw_status ? true : false} onChange={(e) => setSfw_status(e.target.checked)}></input>
                    </div>
                    {user.acount_type === "artist" &&
                        <>
                            <div className="register--formPair">
                                <label htmlFor="editUserActiveComissions">Comisiones activas</label>
                                <input id="editUserActiveComissions" type="checkbox" value={comm_status ? true : false} checked={comm_status ? true : false} onChange={(e) => setComm_status(e.target.checked)}></input>
                            </div>
                            <div className="register--formPair">
                                <label htmlFor="editUserArtStyles">Estilos artisticos</label>
                                <input id="editUserArtStyles" type="text" value={styles} onChange={(e) => setStyles(e.target.value)}></input>
                            </div>
                            {stylesState &&
                                <ul>
                                    {stylesState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                                </ul>}
                        </>
                    }

                    <h3>Cambiar contraseña:</h3>
                    <h4>Solo completar los campos si se desea cambiar</h4>
                    <div className="register--formPair">
                        <label htmlFor="newPass">Nueva contraseña</label>
                        <div className="register--passwordWrap">
                            <input id="newPass" autoComplete="new-password" type={passwordType} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}></input>
                            <span className="register--eyeWrap">
                                <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePasswordType()} />
                            </span>
                        </div>
                    </div>
                    {newPasswordState &&
                        <ul>
                            {newPasswordState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <div className="register--formPair">
                        <label htmlFor="repeatNewUserPass">Repite la contraseña</label>
                        <div className="register--passwordWrap">
                            <input id="repeatNewUserPass" autoComplete="new-password" type={repeatPasswordType} value={repeatNewPassword} onChange={(e) => setRepeatNewPassword(e.target.value)}></input>
                            <span className="register--eyeWrap">
                                <i className={repeatPasswordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => manageRepeatPasswordType()} />
                            </span>
                        </div>
                    </div>
                    {repeatNewPasswordState && <p className="register--formError">{repeatNewPasswordState}</p>}

                    <h3>Confirmar cambios</h3>
                    <div className="register--formPair">
                        <label htmlFor="newuserPass">Contraseña actual</label>
                        <div className="register--passwordWrap">
                            <input id="newuserPass" autoComplete="new-password" type={passwordType} value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <span className="register--eyeWrap">
                                <i className={passwordType === "password" ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"} onClick={() => managePasswordType()} />
                            </span>
                        </div>
                    </div>
                    {passwordState &&
                        <ul>
                            {passwordState.map((value, i) => (<li className="register--formError" key={i}>{value}</li>))}
                        </ul>}
                    <button className="register--formButton" type="submit">Cambiar los datos</button>
                </form>
                :
                <p>{changeDataState}</p>}
            {!changeDataState ?
                <>
                    <button onClick={handleClick}>Cancelar</button>
                </>
                :
                <>
                    <button onClick={handleClick}>Salir</button>
                </>
            }

        </div>
    )
};

export default EditProfileInfo;