import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import RateUser from "./RateUser.jsx";
import axios from 'axios';
import './StateCard.css'

//Module to control the creation of new games.
const StateCardPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const [stateCardSet, setStateCardSet] = useState([]);
    const [createStatus, setCreateStatus] = useState("");
    const [statusVisible, setStatusVisible] = useState(false);
    const [editStateCard, setEditStateCard] = useState(false);
    const [editStateCardID, setEditStateCardID] = useState(0);

    const [rateUserWindowState, setRateUserWindowState] = useState(false);
    const [rateStateCard, setRateStateCard] = useState({})
    const newRef = useRef(null);

    const navigate = useNavigate();


    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        getStateCards();
    }, [user]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            estate: "", comment: ""
        }
    });

    const handleOutsideClick = (e) => {
        if (newRef.current && !newRef.current.contains(e.target)) {
            setRateUserWindowState(false);
        }
    };

    const sendToParent = (data) => {
        setRateUserWindowState(data);
        getStateCards();
    };

    function formatDate(baseDate) {
        const date = new Date(baseDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }

    const manageEditStateCard = (stateCardID) => {

        if (!editStateCard) {
            setEditStateCard(true);
            setEditStateCardID(stateCardID)
        }
        else {
            setEditStateCard(false);
            setEditStateCardID(0)
        }
    }

    const closeEditStateCard = () => {
        setEditStateCard(false);
        setEditStateCardID(0)
    };

    const editWorkcardPage = () => {
        return (
            <div className="stateCard__update">
                <div className="stateCard__update--wrap">
                    <h2 className="stateCard__update--title">Modificar la petición: {editStateCardID}</h2>
                    <form className="stateCard__update--form" onSubmit={handleSubmit((data) => uploadStateCard(data))}>
                        <label className="stateCard__update--label" htmlFor="updateStateCardState">Nuevo estado</label>
                        <input className="stateCard__update--input" id="updateStateCardState" type="text" {...register("estate", { required: { value: true, message: "Se debe introducir el estado." } })}></input>
                        {errors.title?.message && <p className="stateCard__update--formError">{errors.title?.message}</p>}
                        <label className="stateCard__update--label" htmlFor="updateStateCardContent">Nuevo comentario</label>
                        <textarea className="stateCard__update--input textarea" id="updateStateCardContent" type="text" {...register("comment", { required: { value: true, message: "Se debe introducir un comentario." } })}></textarea>
                        {errors.content?.message && <p className="stateCard__update--formError">{errors.content?.message}</p>}
                        <button className="stateCard__update--button" type="submit">Actualizar</button>
                    </form>
                    <button className="stateCard__update--button" onClick={() => closeEditStateCard()}>Cancelar</button>
                </div>
            </div>
        )
    };

    const uploadStateCard = async (data) => {
        if (data) {
            if (!token) { return };

            const payload = {
                status: data.estate,
                commentary: data.comment,
            }


            const uploadStateCardURL = `http://localhost:3000/api/stateCards/update/`;

            try {
                const response = await axios.put(uploadStateCardURL + editStateCardID, payload);
                setCreateStatus(response.data.estado);
                statusMessage();
                reset();
                getStateCards();
                setEditStateCard(false);
                setEditStateCardID(0)
            } catch (error) {
                const errors = error.response.data.errors;
                setCreateStatus(errors);
                statusMessage();
            };
        };
    };

    const getStateCards = async () => {
        if (user.account_type === "client") {
            try {
                const offersUrl = `http://localhost:3000/api/stateCards/client/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setStateCardSet(data);
            } catch (error) {
                console.log(error);
            };
        } else if (user.account_type === "artist") {
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

    //Function to finalice the work. It has a confirmation window that is necessary to accept to finally delete the element.
    const finaliceWork = async (stateCardID) => {
        if (!token) { return };

        const confirmation = await confirm("¿Estas seguro de que quieres confirmar el estado del trabajo como finalizado?");

        if (confirmation) {
            const payload = {
                status: "Finalizado",
                commentary: "Trabajo finalizado correctamente.",
            }

            const uploadStateCardURL = `http://localhost:3000/api/stateCards/update/`;

            try {
                const response = await axios.put(uploadStateCardURL + stateCardID, payload);
                setCreateStatus(response.data.estado);
                statusMessage();
                reset();
                getStateCards();
                setEditStateCard(false);
                setEditStateCardID(0)
            } catch (error) {
                const errors = error.response.data.errors;
                setCreateStatus(errors)
                statusMessage();
            };
        };
    };

    const handleRateUser = stateCard => {
        setRateStateCard(stateCard);
        setRateUserWindowState(true);
    }

    const renderOffers = () => {
        const setOfferContent = (stateCard) => {
            return (
                <div className="stateCard__data">
                    <p className="stateCard__data--content">Artista: {stateCard.artist_name}</p>
                    <p className="stateCard__data--content">Cliente: {stateCard.client_name}</p>
                    <p className="stateCard__data--content">Trabajo: {stateCard.work_title}</p>
                    <p className="stateCard__data--content">Estado: {stateCard.status}</p>
                    <p className="stateCard__data--content">Comentario: {stateCard.commentary}</p>
                    <p className="stateCard__data--content">Creada: {formatDate(stateCard.creation_date)}</p>
                    <p className="stateCard__data--content">Modificada: {formatDate(stateCard.last_modification_date)}</p>
                    {stateCard.status != "Finalizado" ? (
                        user.account_type == "artist" ? (
                            <button className="stateCard__data--button updateCard" onClick={() => manageEditStateCard(stateCard.id)}>Actualizar tarjeta de trabajo</button>) :
                            (<button className="stateCard__data--button" onClick={() => finaliceWork(stateCard.id)}>Finalizar trabajo</button>)
                    ) : user.account_type == "artist" ? (
                        !stateCard.client_rated &&
                        <button className="stateCard__data--button" onClick={() => handleRateUser(stateCard)}>Valorar usuario</button>) : (
                        !stateCard.artist_rated &&
                        <button className="stateCard__data--button" onClick={() => handleRateUser(stateCard)}>Valorar usuario</button>)
                    }
                </div>
            )
        }

        const activeStateCardRender = (stateCard) => {
            if (stateCard.status != "Finalizado") {
                return (
                    < div className="stateCard--active" key={stateCard.id} >
                        {setOfferContent(stateCard)}
                    </div >
                )
            }
        };

        const endedStateCardRender = (stateCard) => {
            if (stateCard.status === "Finalizado") {
                return (
                    < div className="stateCard--finalized" key={stateCard.id} >
                        {setOfferContent(stateCard)}
                    </div >
                )
            }
        };

        return (
            <div className="stateCard">
                <h3 className="stateCard--title">Peticiones activas</h3>
                {stateCardSet ? stateCardSet.map((stateCard) =>
                (
                    activeStateCardRender(stateCard)
                ))
                    : <p className="stateCard--loadStatus">Cargando datos peticiones abiertas...</p>
                }
                <h3 className="stateCard--title">Peticiones finalizadas</h3>
                {stateCardSet ? stateCardSet.map((stateCard) =>
                (
                    endedStateCardRender(stateCard)
                ))
                    : <p className="stateCard--loadStatus">Cargando datos peticiones finalizadas...</p>
                }
            </div>
        );
    };

    const statusMessage = (time = 3000) => {
        setStatusVisible(true);

        setTimeout(() => {
            setStatusVisible(false);
            setCreateStatus("");
        }, time);
    };

    return (
        <div className="stateCard--main" ref={newRef}>
            {statusVisible && <p className={`stateCard--toast ${statusVisible ? "show" : ""}`}>{createStatus}</p>}
            {renderOffers()}
            {user.account_type === "artist" && editStateCard && editWorkcardPage()}
            {rateUserWindowState && <RateUser rateStateCard={rateStateCard} sendToParent={sendToParent} />}
        </div>
    )
}

export default StateCardPage;