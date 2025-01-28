import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import Blur from "react-blur";
import axios from 'axios';

const ProfilePage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");
    const navigate = useNavigate();

    //url
    const clientsUrl = "http://localhost:3000/api/clients/";
    const artistsUrl = "http://localhost:3000/api/artists/";

    //User values
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [nick, setNick] = useState("");
    const [sfwStatus, setSfwStatus] = useState("");
    const [reputation, setReputation] = useState(0);
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [active, setActive] = useState(false);
    const [confirmationPass, setConfirmationPass] = useState("");

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
        setName(user.name);
        setNick(user.nick);
        setSfwStatus(user.sfw_status);
        setReputation(user.reputation);
    };

    return (
        <>
            <h1 className="profile--tittle">Te encuentras en tu perfil, {name}</h1>
            <div className="profile--userData">
                <h3>Información de usuario</h3>
                <p className="profile--text profile--name">Nombre: <span>{name}</span></p>
                <p className="profile--text profile--email">Correo: <span>{email}</span></p>
                <p className="profile--text profile--nick">Nick: <span>{nick}</span></p>
                <p className="profile--text profile--nick">Filtro SFW: <span>{sfwStatus ? "activo" : "inactivo"}</span></p>
                <p className="profile--text profile--nick">Reputación: <span>{reputation}</span></p>
            </div>
        </>
    )

}

export default ProfilePage;