import { useState, useEffect } from "react";
import API_URL from "../../config/api";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
import './RateUser.css'

//Module to control the creation of new games.
const RateUser = ({ rateStateCard, sendToParent }) => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");
    const [rateQueryStatus, setRateQueryStatus] = useState("");

    const navigate = useNavigate();

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

    const handleClick = () => {
        sendToParent(false);
    };

    const handleRate = async (e) => {
        if (!token) { return };

        const rateValue = e.target.value;
        const artistId = rateStateCard.artist_id;
        const clientId = rateStateCard.client_id;
        const workcardId = rateStateCard.id

        const payload = {
            rateValue,
            artistId,
            clientId,
            workcardId
        }

        let rateUserUrl;

        if (user.account_type == "artist") {
            rateUserUrl = `${API_URL}/api/clients/rateUser`;
        } else {
            rateUserUrl = `${API_URL}/api/artists/rateUser`;
        }

        try {
            const response = await axios.put(rateUserUrl, payload);
            setRateQueryStatus(response.data.estado);
        } catch (error) {
            const errors = error.response.data.errors;
            setRateQueryStatus(errors)
        };
    };

    return (
        <div className="rateUser">
            <div className="rateUser__card">
                {rateQueryStatus ?
                    <>

                        <h2 className="rateUser__card--status">{rateQueryStatus}</h2>
                        <button className="rateUser__card--button" onClick={handleClick}>Cerrar</button>
                    </> :
                    <>
                        <h2 className="rateUser__card--title">Valorar usuario</h2>
                        <div className="rateUser__card--wrap">
                            <button className="rateUser__card--rateButton" value={1} onClick={(e) => handleRate(e)}>1</button>
                            <button className="rateUser__card--rateButton" value={2} onClick={(e) => handleRate(e)}>2</button>
                            <button className="rateUser__card--rateButton" value={3} onClick={(e) => handleRate(e)}>3</button>
                            <button className="rateUser__card--rateButton" value={4} onClick={(e) => handleRate(e)}>4</button>
                            <button className="rateUser__card--rateButton" value={5} onClick={(e) => handleRate(e)}>5</button>
                        </div>
                        <button className="rateUser__card--button" onClick={handleClick}>Cancelar</button>
                    </>
                }
            </div>
        </div>
    )
}

export default RateUser;