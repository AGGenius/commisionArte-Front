import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
import './RateUser.css'

//Module to control the creation of new games.
const RateUser = ({ sendToParent }) => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

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

    const handleRate = (e) => {
        console.log(e.target.value)
    };

    return (
        <div className="rateUser__window">
            <div className="rateUser__windowWrap">
                <h2>Valorar usuario</h2>
                <div className="rateUser__valuesWrap">
                    <button value={1} onClick={(e) => handleRate(e)}>1</button>
                    <button value={2} onClick={(e) => handleRate(e)}>2</button>
                    <button value={3} onClick={(e) => handleRate(e)}>3</button>
                    <button value={4} onClick={(e) => handleRate(e)}>4</button>
                    <button value={5} onClick={(e) => handleRate(e)}>5</button>
                </div>
                <button onClick={handleClick}>Cancelar</button>
            </div>
        </div>
    )
}

export default RateUser;