import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const StateCardPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const [stateCardSet, setStateCardSet] = useState([]);
    const [createStatus, setCreateStatus] = useState("");
    const [editStateCard, setEditStateCard] = useState(false);
    const [editStateCardID, setEditStateCardID] = useState(0);

    const navigate = useNavigate();


    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
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

    const editWorkcardPage = () => {
        return (
            <>
                <h2 className="addGame--title">Modificar la petición: {editStateCardID}</h2>
                <form className="addGame--form" onSubmit={handleSubmit((data) => uploadStateCard(data))}>
                    <label htmlFor="createGameTitle">Estado actual</label>
                    <input id="createGameTitle" type="text" {...register("estate", { required: { value: true, message: "Se debe introducir el estado." } })}></input>
                    {errors.title?.message && <p className="addGame--formError">{errors.title?.message}</p>}
                    <label htmlFor="createGameDevelopa">Nuevo comentario</label>
                    <textarea id="createGameDevelopa" type="text" {...register("comment", { required: { value: true, message: "Se debe introducir un comentario." } })}></textarea>
                    {errors.content?.message && <p className="addGame--formError">{errors.content?.message}</p>}
                    <button className="addGame--formButton" type="submit">Actualizar tarjeta de trabajo</button>
                </form>
            </>
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
                reset();
                getStateCards();
                setEditStateCard(false);
                setEditStateCardID(0)
            } catch (error) {
                const errors = error.response.data.errors;
                setCreateStatus(errors)
            };
        };
    };

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
                    <button onClick={() => manageEditStateCard(stateCard.id)}>Actualizar tarjeta de trabajo</button>
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
                {user.acount_type === "artist" && editStateCard && editWorkcardPage()}
            </div>
        </div>
    )
}

export default StateCardPage;