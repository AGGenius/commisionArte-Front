import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const StateCardPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const [stateCardSet, setStateCardSet] = useState([]);
    const [createStatus, setCreateStatus] = useState("");

    const navigate = useNavigate();


    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        getStateCards();
    }, [user]);

    function formatDate(baseDate) {
        const date = new Date(baseDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }

    const getStateCards = async () => {
        if (user.acount_type === "client") {
            try {
                const offersUrl = `http://localhost:3000/api/stateCards/client/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setStateCardSet(data);
            } catch (error) {
                console.log(error);
            };
        } else if (user.acount_type === "artist") {
            try {
                const offersUrl = `http://localhost:3000/api/stateCards/artist/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setStateCardSet(data);
            } catch (error) {
                console.log(error);
            };
        }
    };

    const renderOffers = () => {
        const baseOfferContent = (stateCard) => {
            return (
                <>
                    <p>Artista: {stateCard.artist_name}</p>
                    <p>Cliente: {stateCard.client_name}</p>
                    <p>Trabajo: {stateCard.work_title}</p>
                    <p>Estado: {stateCard.status}</p>
                    <p>Comentario: {stateCard.commentary}</p>
                    <p>Creada: {formatDate(stateCard.creation_date)}</p>
                    <p>Modificada: {formatDate(stateCard.last_modification_date)}</p>
                </>
            )
        }

        const baseOfferRender = (stateCard) => {

            return (
                < div className="games--gameCard" key={stateCard.id} >
                    <div className="games--gameCardData">
                        {baseOfferContent(stateCard)}
                    </div>
                </div >
            )
        }

        return (
            <>
                {createStatus && <p>{createStatus}</p>}
                <h2>Peticiones publicas</h2>
                {stateCardSet ? stateCardSet.map((stateCard) =>
                (
                    baseOfferRender(stateCard)
                ))
                    : <p>Cargando datos peticiones abiertas...</p>
                }
            </>
        );
    };

    return (
        <div className="addGame">
            <div>
                {renderOffers()}
            </div>
        </div>
    )
}

export default StateCardPage;