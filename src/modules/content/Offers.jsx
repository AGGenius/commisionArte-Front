import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
import './Offers.css'

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

    const [showClientData, setShowClientData] = useState("");
    const [showArtistData, setShowArtistData] = useState("");
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
        if (user.account_type === "client") {
            try {
                const offersUrl = `http://localhost:3000/api/openWorks/client/`;
                const response = await axios.get(offersUrl + user.id);
                const data = response.data;

                setOfferSet(data);
            } catch (error) {
                console.log(error);
            };
        } else if (user.account_type === "artist") {
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
        const confirmation = await confirm("Confirma para borrar la solicitud");

        if (!user.id) { return };

        if (confirmation) {
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
    };

    const takeOffer = async (e) => {
        const confirmation = await confirm("Confirma para aceptar la solicitud");

        if (!user.id) { return };

        if (confirmation) {
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
    };

    const declineOffer = async (e, offer) => {
        const confirmation = await confirm("Confirma para rechazar la solicitud");

        if (!user.id) { return };

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/decline/`;
        const rejectUrl = `http://localhost:3000/api/rejected/upload`;

        if (offer) {
            if (!token) { return };

            if (confirmation) {
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
    };

    const confirmOffer = async (e, offer) => {
        const confirmation = await confirm("Confirma para confirmar la solicitud");

        if (!token) { return };

        const id = e.target.value;
        const offerUrl = `http://localhost:3000/api/openWorks/confirm/`;

        if (confirmation) {
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
    };

    const generateDeleteOfferButton = (offer) => {
        if (token) {
            if (offer.status === "open") {
                return (
                    <>
                        {<button className="createOffer--button delete" value={offer.id} onClick={(e) => deleteOffer(e)}>Borrar</button>}
                    </>);
            } else if (offer.status === "confirmed") {
                return (
                    <>
                    </>);
            } else {
                return (
                    <div className="baseOffer__form--pair">
                        {<button className="createOffer--button decline" value={offer.id} onClick={(e) => declineOffer(e, offer)}>Rechazar</button>}
                        {<button className="createOffer--button confirm" value={offer.id} onClick={(e) => confirmOffer(e, offer)}>Confirmar</button>}
                    </div>
                );
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
                    {<button className="createOffer--button take" value={offer.id} onClick={(e) => takeOffer(e)}>{status}</button>}
                </>);
        }
    };

    const clientOfferPage = () => {
        return (
            <div className="createOffer">
                <h2 className="createOffer__title">Realizar una peticion</h2>
                <form className="createOffer__form" onSubmit={handleSubmit((data) => uploadOffer(data))}>
                    <label className="createOffer__form--label" htmlFor="createOfferTitle">Titulo</label>
                    <input className="createOffer__form--input" id="createOfferTitle" type="text" {...register("title", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                    {errors.title?.message && <p className="createOffer__form--error">{errors.title?.message}</p>}
                    <label className="createOffer__form--label" htmlFor="createOfferContent">Solicitud</label>
                    <textarea className="createOffer__form--input" id="createOfferContent" type="text" {...register("content", { required: { value: true, message: "Se debe introducir un texto para la solicitud." } })}></textarea>
                    {errors.content?.message && <p className="createOffer__form--error">{errors.content?.message}</p>}
                    <div className="createOffer__form--pair">
                        <label className="createOffer__form--label check" htmlFor="createOfferSFWcheck">SFW</label>
                        <input className="createOffer__form--checkbox" id="createOfferSFWcheck" type="checkbox" {...register("sfw_status")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                    </div>
                    {errors.sfw_status?.message && <p className="createOffer__form--error">{errors.sfw_status?.message}</p>}
                    <button className="createOffer__form--sendButton" type="submit">Crear</button>
                </form>
                {createStatus && <p className="createOffer__form--status">{createStatus}</p>}
            </div>
        )
    };

    const offerStatus = (offer) => {
        if (offer.status === "open") {
            return "Abierta";
        } else if (offer.status === "taken") {
            return "Tomada";
        } else if (offer.status === "confirmed") {
            return "Confirmada";
        };
    }

    const generateShowClientButton = (offer) => {
        return (
            <>
                <button className="offers--button" onClick={() => loadClientInfo(offer)}>Solicitante</button>
            </>
        )
    };

    const generateShowArtistButton = (offer) => {
        if (offer.artist_id === 0 || offer.status === "open") {
            return;
        }

        return (
            <>
                <button className="offers--button" onClick={() => loadArtistInfo(offer)}>Artista</button>
            </>
        )
    };

    const loadClientInfo = async (offer) => {
        if (offer.id === actualOfferDataID) {
            setShowClientData(false);
            setActualOfferDataID(0);
            return;
        };

        try {
            const clientUrl = `http://localhost:3000/api/clients/`;
            const response = await axios.get(clientUrl + offer.client_id);
            const data = response.data;

            setActualOfferDataID(offer.id);
            setClientData(data);
            if (!showClientData) { setShowClientData(true); };
        } catch (error) {
            console.log(error);
        };
    }

    const loadArtistInfo = async (offer) => {
        if (offer.artist_id === 0 || offer.status === "open") {
            setShowArtistData(false);
            setActualOfferDataID(0);
            return;
        };

        if (offer.offer_id === actualOfferDataID) {
            setShowArtistData(false);
            setActualOfferDataID(0);
            return;
        };

        try {
            const artistUrl = `http://localhost:3000/api/artists/`;
            const response = await axios.get(artistUrl + offer.artist_id);
            const data = response.data;

            setActualOfferDataID(offer.offer_id);
            setArtistData(data);
            if (!showArtistData) { setShowArtistData(true); };
        } catch (error) {
            //console.log(error);
        };
    }

    const closeDataCard = () => {
        setShowArtistData(false);
        setShowClientData(false);
        setActualOfferDataID(0);
        return;
    }

    const renderOffers = () => {
        const baseOfferContent = (offer) => {
            return (
                <div className="baseOffer">
                    <p className="baseOffer__content">Titulo: {offer.title}</p>
                    <p className="baseOffer__content">Contenido: {offer.content}</p>
                    <p className="baseOffer__content">Estado: {offerStatus(offer)}</p>
                    <p className="baseOffer__content">SFW: {offer.sfw_status ? "SI" : "NO"}</p>
                    <p className="baseOffer__content">Creada: {formatDate(offer.creation_date)}</p>
                    {user.account_type === "client" && offer.status === "taken" && <p className="baseOffer__content">Artist ID: {offer.artist_id}</p>}
                    {user.account_type === "client" ? generateDeleteOfferButton(offer) : generateTakeOfferButton(offer)}
                    {user.account_type === "client" ? generateShowArtistButton(offer) : generateShowClientButton(offer)}
                </div>
            )
        }

        const baseOfferRender = (offer) => {
            return (
                < div className="offer__card" key={offer.id} >
                    {baseOfferContent(offer)}
                </div >
            )
        }

        if (user.account_type === "artist") {
            return (
                <div className="offers--artist">
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
                </div>
            )
        } else {
            return (
                <div className="offers--client">
                    {offerSet ? offerSet.map((offer) =>
                    (
                        baseOfferRender(offer)
                    ))
                        : <p>Cargando peticiones realizadas...</p>
                    }
                </div>
            )
        }
    }

    const clientOfferContent = () => {
        if (clientData) {
            return (
                <div className="clientData">
                    <div className="clientData--wrap">
                        <p className="clientData--text">Nick: {clientData.nick}</p>
                        <p className="clientData--text">Email de contacto: {clientData.contact_email}</p>
                        {clientData.telephone && <p className="clientData--wrap">Telefono de contacto: {clientData.telephone}</p>}
                        <p className="clientData--text">Reputacion: {clientData.reputation}</p>
                        <p className="clientData--text">Fecha de Registro: {new Date(clientData.register).toLocaleDateString("es-ES")}</p>
                        {<button className="clientData--button" onClick={(e) => closeDataCard(e)}>Cerrar</button>}
                    </div>
                </div>
            )
        };
    }

    const artistOfferContent = () => {
        if (artistData) {
            return (
                <div className="artistData">
                    <div className="artistData--wrap">
                        <p className="artistData--text">Nick: {artistData.nick}</p>
                        <p className="artistData--text">Email de contacto: {artistData.contact_email}</p>
                        {artistData.telephone && <p className="artistData--text">Telefono de contacto: {artistData.telephone}</p>}
                        <p className="artistData--text">Estilos: {artistData.styles}</p>
                        <p className="artistData--text">Estilos</p>
                        <div className="artistData--text--styles--wrap">
                            {artistData.styles.split(',').map((style, i) => (
                                <span className="artistData--text--stylesList--item" key={i}>{style}</span>
                            ))}
                        </div>
                        <p className="artistData--text">Reputacion: {artistData.reputation}</p>
                        <p className="artistData--text">Fecha de Registro: {new Date(artistData.register).toLocaleDateString("es-ES")}</p>
                        {<button className="clientData--button" onClick={(e) => closeDataCard(e)}>Cerrar</button>}
                    </div>
                </div>
            )
        };
    }

    return (
        <div className="offers">
            {showClientData && clientOfferContent()}
            {showArtistData && artistOfferContent()}
            {renderOffers()}
            {user.account_type === "client" && clientOfferPage()}
        </div>
    )
}

export default OffersPage;