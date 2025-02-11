import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const ClientOffersPage = () => {
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
        getMyOffers();
    }, [user]);

    const getMyOffers = async () => {
        try {
            const offersUrl = `http://localhost:3000/api/openWorks/client/`;
            const response = await axios.get(offersUrl + user.id);
            const data = response.data;
            setOfferSet(data);
        } catch (error) {
            console.log(error);
        };
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

            //Añadir en back el limite de cinco peticiones en los middleware de los open work. 
            //Añadir la posibilidad de borrar peticiones (mas adelante solo se podrán las que no tengan artista asociado distinto del dummy 0. Si un trabajo tiene artista no se podra borrar
            // hasta que el artista se de de baja de esa ficha)
            //continuar hacia que el artista pueda ver los trabajos publicados y aceptar alguno, ver los aceptados, y rechazarlos una vez aceptados. La work card debe generarse cuando se
            // acepta un trabajo, y por tanto puede desaparecer una vez se rechaza o se completa.

            console.log(payload)
            try {
                const response = await axios.post(addOffer, payload);
                setCreateStatus(response.data.estado);
                reset();
                getMyOffers();
            } catch (error) {
                const errors = error.response.data.errors;
                setCreateStatus(errors)
            };
        };
    };

    return (
        <div className="addGame">
            <h2> Mis peticiones</h2>
            <div>
                {offerSet ? offerSet.map((offer) =>
                (
                    <div className="games--gameCard" key={offer.id}>
                        <div className="games--gameCardData">
                            <p>Titulo: {offer.tittle}</p>
                            <p>Contenido: {offer.content}</p>
                        </div>
                    </div>
                ))
                    : <p>Cargando datos...</p>
                }
            </div>
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
            {createStatus && <p>{createStatus}</p>}
        </div>
    )
}

export default ClientOffersPage;