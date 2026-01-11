import { useEffect, useState } from "react";
import API_URL from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import axios from "axios";
import EditProfileInfo from "./EditProfileInfo";
import './Profile.css'

const ProfilePage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    //Edit personal info
    const [activeEditWindow, setActiveEditWindow] = useState(false);

    //Erase account
    const [activeEraseWindow, setEraseEditWindow] = useState(false);
    const [changeDataState, setChangeDataState] = useState("");

    //url
    const clientsUrl = `${API_URL}/api/clients/`;
    const artistsUrl = `${API_URL}/api/artists/`;

    //User values
    const [email, setEmail] = useState("");
    const [contactEmail, setContactEmail] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [telephone, setTelephone] = useState("");
    const [sfwStatus, setSfwStatus] = useState("");
    const [reputation, setReputation] = useState(0);
    const [styles, setStyles] = useState([]);

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        getUserData();
    }, [user])

    const getUserData = async () => {
        setEmail(user.email);
        setContactEmail(user.contact_email);
        setName(user.name);
        setNick(user.nick);
        setTelephone(user.telephone);
        setSfwStatus(user.sfw_status);
        setReputation(user.reputation);

        if (user.account_type === "artist") {
            const formatedStyles = user.styles.replace(/^{|}$/g, "").split(",").map(s => s.replace(/^"|"$/g, "").trim());
            setStyles(formatedStyles);
        };
    };

    const sendToParent = (data) => {
        setChangeDataState("");
        setActiveEditWindow(data);
    };

    //Function to delete the user. It has a confirmation window that is necessary to accept to finally delete the element.
    const deleteUser = async () => {
        setChangeDataState("");
        const confirmation = await confirm("Confirma para borrar el usuario");

        if (confirmation) {
            try {
                let response = "";

                if (user.account_type === "artist") {
                    response = await axios.delete(artistsUrl + user.id);
                } else {
                    response = await axios.delete(clientsUrl + user.id);
                }

                if (response) {
                    localStorage.removeItem("token");
                    setUser({});
                    setChangeDataState(response.data.estate);
                    setEraseEditWindow(true);
                } else {
                    setChangeDataState("Error en el servidor");
                }
            } catch (error) {
                setChangeDataState("No fue posible borrar la cuenta.");
            };
        };
    };

    const exitPage = () => {
        navigate("/");
    }

    const profilePage = () => {
        return (
            <div className="profile">
                <h1 className="profile__title">Perfil de {name}</h1>
                <div className="profile__userData">
                    <h3 className="profile__subtitle">Información de usuario</h3>
                    <p className="profile__text">Nombre:
                        <span className="profile__text profile__name">{name}</span>
                    </p>
                    <p className="profile__text">Correo:
                        <span className="profile__text profile__email">{email}</span>
                    </p>
                    <p className="profile__text">Correo de contacto:
                        <span className="profile__text profile__email">{contactEmail}</span>
                    </p>
                    <p className="profile__text">Nick:
                        <span className="profile__text profile__nick">{nick}</span>
                    </p>
                    <p className="profile__text">Telefono:
                        <span className="profile__text profile__phone">{telephone}</span>
                    </p>
                    <p className="profile__text">Filtro SFW:
                        <span className="profile__text profile__sfw">{sfwStatus ? "activo" : "inactivo"}</span>
                    </p>
                    <p className="profile__text">Reputación:
                        <span className="profile__text profile__score">{reputation}</span>
                    </p>
                    {user.account_type === "artist" &&
                        <div className="profile__userStyles">
                            <p className="profile__userStyles--title">Estilos:</p>
                            <div className="profile__userStyles--list">
                                {styles.map((style, i) => (
                                    <span className="profile__userStyles--style" key={i}>{style}</span>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                <button className="profile__editUserButton" onClick={() => setActiveEditWindow(true)}>ACTUALIZAR INFORMACION</button>
                <button className="profile__deleteUserButton" onClick={() => deleteUser()}>BORRAR CUENTA</button>
                {changeDataState && <h3 className="profile__editUserState">{changeDataState}</h3>}
            </div>
        );
    };

    const deletePage = () => {
        return (
            <>
                <h1 className="profile__title">Esperamos volver a verte por aqui.</h1>
                <p>{changeDataState}</p>
                <button onClick={() => exitPage()}>SALIR</button>
            </>
        );
    };

    return (
        <>
            {activeEditWindow ? <EditProfileInfo sendToParent={sendToParent} /> : activeEraseWindow ? deletePage() : profilePage()}
        </>
    );
}

export default ProfilePage;