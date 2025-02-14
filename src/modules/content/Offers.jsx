import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const OffersPage = () => {
    const { user, setUser } = useUserContext();
    const [active, setActive] = useState(false);
    const [token, setToken] = useState("");
    const [createStatus, setCreateStatus] = useState("");
    const [offerSet, setOfferSet] = useState([]);
    const addOffer = "http://localhost:3000/api/openWorks/upload";
    const navigate = useNavigate();

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
        } else {
            try {
                const offersUrl = `http://localhost:3000/api/openWorks`;
                const response = await axios.get(offersUrl);
                const data = response.data;

                setOfferSet(data);
            } catch (error) {
                console.log(error);
            };

        }
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            artist_id: "", client_id: "", tittle: "", content: "", sfw_status: false
        }
    });

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const uploadOffer = async (data) => {

        if (data) {
            if (!token) { return };

            const payload = {
                artist_id: 0,
                client_id: user.id,
                tittle: data.tittle,
                content: data.content,
                sfw_status: data.sfw_status
            }

            //Añadir la posibilidad de borrar peticiones (mas adelante solo se podrán las que no tengan artista asociado distinto del dummy 0. Si un trabajo tiene artista no se podra borrar
            // hasta que el artista se de de baja de esa ficha)
            //continuar hacia que el artista pueda ver los trabajos publicados y aceptar alguno, ver los aceptados, y rechazarlos una vez aceptados. La work card debe generarse cuando se
            // acepta un trabajo, y por tanto puede desaparecer una vez se rechaza o se completa.

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

    const generateDeleteOfferButton = (offer) => {
        if (token) {
            if (offer.status === "open") {
                return (
                    <>
                        {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => deleteOffer(e)}>Borrar solicitud</button>}
                    </>);
            } else {
                return (
                    <>
                        {<button className="posts--gameCardButton" value={offer.id} disabled={true}>Solicitud aceptada</button>}
                    </>);
            }

        }
    };

    const generateTakeOfferButton = (offer) => {
        if (token) {
            return (
                <>
                    {<button className="posts--gameCardButton" value={offer.id} onClick={(e) => takeOffer(e)}>{offer.status === "open" ? "Tomar solicitud" : "Anular Solicitud"}</button>}
                </>);
        }
    };

    const clientOfferPage = () => {
        return (
            <>
                <h2 className="addGame--tittle">Sube una peticion</h2>
                <form className="addGame--form" onSubmit={handleSubmit((data) => uploadOffer(data))}>
                    <label htmlFor="createGameTittle">Titulo</label>
                    <input id="createGameTittle" type="text" {...register("tittle", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                    {errors.tittle?.message && <p className="addGame--formError">{errors.tittle?.message}</p>}
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

    const renderOffers = () => {
        const baseOfferRender = (offer) => {

            return (
                < div className="games--gameCard" key={offer.id} >
                    <div className="games--gameCardData">
                        <p>Titulo: {offer.tittle}</p>
                        <p>Contenido: {offer.content}</p>
                        <p>Estado: {offer.status === "open" ? "Abierta" : "Tomada"}</p>
                        <p>SFW: {offer.sfw_status ? "SI" : "NO"}</p>
                        <p>Creada: {formatDate(offer.creation_date)}</p>
                        {user.acount_type === "client" ? generateDeleteOfferButton(offer) : generateTakeOfferButton(offer)}
                    </div>
                </div >
            )
        }

        if (user.acount_type === "artist") {
            return (
                <>
                    {createStatus && <p>{createStatus}</p>}
                    <h2>Peticiones publicas</h2>
                    {offerSet ? offerSet.filter((offer) => offer.status === "open").map((offer) =>
                    (
                        baseOfferRender(offer)
                    ))
                        : <p>Cargando datos peticiones abiertas...</p>
                    }
                    <h2>Peticiones aceptadas</h2>
                    {offerSet ? offerSet.filter((offer) => offer.status === "taken" & offer.artist_id === user.id).map((offer) =>
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