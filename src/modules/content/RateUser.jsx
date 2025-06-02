import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
import './RateUser.css'

//Module to control the creation of new games.
const RateUser = () => {
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

    return (
        <div className="rateUser__form">
            <div className="rateUser__formWrap">
                <h2>Valorar usuario</h2>
            </div>
        </div>
    )
}

export default RateUser;