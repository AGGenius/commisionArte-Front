import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import axios from "axios";
import EditProfileInfo from "./EditProfileInfo";

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
    const clientsUrl = "http://localhost:3000/api/clients/";
    const artistsUrl = "http://localhost:3000/api/artists/";

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
            <>
                <h1 className="profile--tittle">Te encuentras en tu perfil, {name}</h1>
                <div className="profile--userData">
                    <h3>Información de usuario</h3>
                    <p className="profile--text profile--name">Nombre: <span>{name}</span></p>
                    <p className="profile--text profile--email">Correo: <span>{email}</span></p>
                    <p className="profile--text profile--email">Correo de contacto: <span>{contactEmail}</span></p>
                    <p className="profile--text profile--nick">Nick: <span>{nick}</span></p>
                    <p className="profile--text profile--nick">Telefono: <span>{telephone}</span></p>
                    <p className="profile--text profile--nick">Filtro SFW: <span>{sfwStatus ? "activo" : "inactivo"}</span></p>
                    <p className="profile--text profile--nick">Reputación: <span>{reputation}</span></p>
                    {user.account_type === "artist" &&
                        <>
                            <p>Estilos:</p>
                            <div>
                                {styles.map((style, i) => (
                                    <span className="images--styles" key={i}>{style}</span>
                                ))}
                            </div>
                        </>
                    }
                </div>
                <button onClick={() => setActiveEditWindow(true)}>ACTUALIZAR INFORMACION</button>
                <button onClick={() => deleteUser()}>BORRAR CUENTA</button>
                {changeDataState && <h3>{changeDataState}</h3>}
            </>
        );
    };

    const deletePage = () => {
        return (
            <>
                <h1 className="profile--tittle">Esperamos volver a verte por aqui.</h1>
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