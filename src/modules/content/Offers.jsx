import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const OffersPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const navigate = useNavigate();

    const [active, setActive] = useState(false);
    const [createStatus, setCreateStatus] = useState("");
    const [offerSet, setOfferSet] = useState([]);
    const [offerArtistSet, setArtisOfferSet] = useState([]);
    const addOffer = "http://localhost:3000/api/openWorks/upload";

    const [showData, setShowData] = useState("");
    const [clientData, setClientData] = useState([]);
    const [artistData, setArtistData] = useState([]);
    const [actualOfferDataID, setActualOfferDataID] = useState(0);

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
        getOffers();
    }, [user]);

    const getOffers = async () => {
        if (user.acount_type === "client") {
            try {
                const offersUrl = `http://localhost:3000/api/openWorks/client/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setOfferSet(data);
            } catch (error) {
                console.log(error);
            };
        } else if (user.acount_type === "artist") {
            try {
                const offersUrl = `http://localhost:3000/api/openWorks/available/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setOfferSet(data);
            } catch (error) {
                console.log(error);
            };

            try {
                const offersUrl = `http://localhost:3000/api/openWorks/artist/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setArtisOfferSet(data);
            } catch (error) {
                console.log(error);
            };
        }
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            artist_id: "", client_id: "", title: "", content: "", sfw_status: false
        }
    });

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const uploadOffer = async (data) => {
        if (data) {
            if (!token) { return };

            const payload = {
                artist_id: 0,
                client_id: user.id,
                title: data.title,
                content: data.content,
                sfw_status: data.sfw_status
            }

            try {
                const response = await axios.post(addOffer, payload);
                setCreateStatus(response.data.estado);
                reset();
                getOffers();
            } catch (error) {
                console.log(error)
                const errors = error.response.data.errors;
                setCreateStatus(errors)
            };
        };
    };

    function formatDate(baseDate) {
        const date = new Date(baseDate);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}-${month}-${year}`;
    }

    const deleteOffer = async (e) => {
        if (!user.id) { return };

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/`;

        try {
            const response = await axios.delete(offerUrl + id);;
            setCreateStatus(response.data.estado);
            getOffers();
        } catch (error) {
            const errors = error.response.data.errors;
            setCreateStatus(errors)
        };
    };

    const takeOffer = async (e) => {
        if (!user.id) { return };

        const payload = {
            artist_id: user.id,
        }

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/take/`;

        try {
            const response = await axios.put(offerUrl + id, payload);;
            setCreateStatus(response.data.estado);
            getOffers();
        } catch (error) {
            const errors = error.response.data.estado;
            setCreateStatus(errors)
        };
    };

    const declineOffer = async (e, offer) => {
        if (!user.id) { return };

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/decline/`;
        const rejectUrl = `http://localhost:3000/api/rejected/upload`;

        if (offer) {
            if (!token) { return };

            const payload = {
                artist_id: offer.artist_id,
                client_id: user.id,
                openWork_id: id,
            }

            try {
                const response = await axios.post(rejectUrl, payload);
            } catch (error) {
                const errors = error.response.data.errors;
            };

            try {
                const response = await axios.put(offerUrl + id);;
                setCreateStatus(response.data.estado);
                getOffers();
            } catch (error) {
                const errors = error.response.data.estado;
                setCreateStatus(errors)
            };
        };
    };

    const confirmOffer = async (e, offer) => {
        if (!token) { return };

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/confirm/`;

        const payload = {
            artist_id: offer.artist_id,
            client_id: user.id,
            openWork_id: id,
        }

        try {
            const response = await axios.put(offerUrl + id, payload);
            setCreateStatus(response.data.estado);
            getOffers();
        } catch (error) {
            const errors = error.response.data.estado;
            setCreateStatus(errors)
        };
    };

    const generateDeleteOfferButton = (offer) => {
        if (token) {
            if (offer.status === "open") {
                return (
                    <>
                        {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => deleteOffer(e)}>Borrar solicitud</button>}
                    </>);
            } else if (offer.status === "confirmed") {
                return (
                    <>
                    </>);
            } else {
                return (
                    <>
                        {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => declineOffer(e, offer)}>Rechazar</button>}
                        {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => confirmOffer(e, offer)}>Confirmar</button>}
                    </>);
            }
        }
    };

    const generateTakeOfferButton = (offer) => {
        let status = "";

        if (offer.status === "open") {
            status = "Tomar solicitud";
        } else {
            status = "Anular Solicitud";
        }

        if (token && offer.status !== "confirmed") {
            return (
                <>
                    {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => takeOffer(e)}>{status}</button>}
                </>);
        }
    };

    const clientOfferPage = () => {
        return (
            <>
                <h2 className="addGame--title">Sube una peticion</h2>
                <form className="addGame--form" onSubmit={handleSubmit((data) => uploadOffer(data))}>
                    <label htmlFor="createGameTitle">Titulo</label>
                    <input id="createGameTitle" type="text" {...register("title", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                    {errors.title?.message && <p className="addGame--formError">{errors.title?.message}</p>}
                    <label htmlFor="createGameDevelopa">Solicitud</label>
                    <textarea id="createGameDevelopa" type="text" {...register("content", { required: { value: true, message: "Se debe introducir un texto para la solicitud." } })}></textarea>
                    {errors.content?.message && <p className="addGame--formError">{errors.content?.message}</p>}
                    <label htmlFor="createGameDevelopa">SFW</label>
                    <input id="editUserState" type="checkbox" {...register("sfw_status")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                    {errors.sfw_status?.message && <p className="addGame--formError">{errors.sfw_status?.message}</p>}
                    <button className="addGame--formButton" type="submit">Crear solicitud</button>
                </form>
            </>
        )
    };

    const offerStatus = (offer) => {
        if (offer.status === "open") {
            return "Abierta";
        } else if (offer.status === "taken") {
            return "Tomada";
        } else if (offer.status === "confirmed") {
            return "Confirmada";
        }
    }

    const generateShowClientButton = (offer) => {
        return (
            <>
                <button onClick={() => loadClientInfo(offer)}>Ver solicitante</button>
            </>
        )
    };

    const generateShowArtistButton = (offer) => {
        if(offer.artist_id === 0 || offer.status === "open") {
            return;
        }

        return (
            <>
                <button onClick={() => loadArtistInfo(offer)}>Ver artista</button>
            </>
        )
    };

    const loadClientInfo = async (offer) => {
        if (offer.id === actualOfferDataID) {
            setShowData(false);
            setActualOfferDataID(0);
            return;
        }

        try {
            const clientUrl = `http://localhost:3000/api/clients/`;
            const response = await axios.get(clientUrl + offer.client_id);
            const data = response.data;

            setActualOfferDataID(offer.id);
            setClientData(data);
            if (!showData) { setShowData(true); };
        } catch (error) {
            console.log(error);
        };
    }

    const loadArtistInfo = async (offer) => {
        if(offer.artist_id === 0 || offer.status === "open") {
            setShowData(false);
            setActualOfferDataID(0);
            return;
        }

        if (offer.offer_id === actualOfferDataID) {
            setShowData(false);
            setActualOfferDataID(0);
            return;
        }

        try {
            const artistUrl = `http://localhost:3000/api/artists/`;
            const response = await axios.get(artistUrl + offer.artist_id);
            const data = response.data;

            setActualOfferDataID(offer.offer_id);
            setArtistData(data);
            if (!showData) { setShowData(true); };
        } catch (error) {
            console.log(error);
        };
    }

    const renderOffers = () => {
        const baseOfferContent = (offer) => {
            return (
                <>
                    <p>Titulo: {offer.title}</p>
                    <p>Contenido: {offer.content}</p>
                    <p>Estado: {offerStatus(offer)}</p>
                    <p>SFW: {offer.sfw_status ? "SI" : "NO"}</p>
                    <p>Creada: {formatDate(offer.creation_date)}</p>
                    {user.acount_type === "client" && offer.status === "taken" && <p>Artist ID: {offer.artist_id}</p>}
                    {user.acount_type === "client" ? generateDeleteOfferButton(offer) : generateTakeOfferButton(offer)}
                    {user.acount_type === "client" ? generateShowArtistButton(offer) : generateShowClientButton(offer)}
                </>
            )
        }

        const clientOfferContent = () => {
            if (clientData) {
                return (
                    <div>
                        <p>Nick: {clientData.nick}</p>
                        <p>Email de contacto: {clientData.contact_email}</p>
                        {clientData.telephone && <p>Telefono de contacto: {clientData.telephone}</p>}
                        <p>Reputacion: {clientData.reputation}</p>
                        <p>Fecha de Registro: {new Date(clientData.register).toLocaleDateString("es-ES")}</p>
                    </div>
                )
            };
        }

        const artistOfferContent = () => {
            if (artistData) {
                return (
                    <div>
                        <p>Nick: {artistData.nick}</p>
                        <p>Email de contacto: {artistData.contact_email}</p>
                        {artistData.telephone && <p>Telefono de contacto: {artistData.telephone}</p>}
                        <p>Estilos: {artistData.styles}</p>
                        <p>Reputacion: {artistData.reputation}</p>
                        <p>Fecha de Registro: {new Date(artistData.register).toLocaleDateString("es-ES")}</p>
                    </div>
                )
            };
        }


        const baseOfferRender = (offer) => {

            return (
                < div className="games--gameCard" key={offer.id} >
                    <div className="games--gameCardData">
                        {baseOfferContent(offer)}
                    </div>
                </div >
            )
        }

        if (user.acount_type === "artist") {
            return (
                <>
                    {showData && clientOfferContent()}
                    {createStatus && <p>{createStatus}</p>}
                    <h2>Peticiones publicas</h2>
                    {offerSet ? offerSet.map((offer) =>
                    (
                        baseOfferRender(offer)
                    ))
                        : <p>Cargando datos peticiones abiertas...</p>
                    }
                    <h2>Peticiones aceptadas</h2>
                    {offerArtistSet ? offerArtistSet.map((offer) =>
                    (
                        baseOfferRender(offer)
                    ))
                        : <p>Cargando peticiones aceptadas...</p>
                    }
                </>
            )
        } else {
            return (
                <>
                    {showData && artistOfferContent()}
                    {createStatus && <p>{createStatus}</p>}
                    <h2>Mis peticiones</h2>
                    {offerSet ? offerSet.map((offer) =>
                    (
                        baseOfferRender(offer)
                    ))
                        : <p>Cargando peticiones realizadas...</p>
                    }
                </>
            )
        }

    }

    return (
        <div className="addGame">
            <div>
                {renderOffers()}
                {user.acount_type === "client" && clientOfferPage()}
            </div>

        </div>
    )
}

export default OffersPage;