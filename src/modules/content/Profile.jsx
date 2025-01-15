import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Blur from "react-blur";
import axios from 'axios';

const ProfilePage = () => {
    const navigate = useNavigate();

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    return (
        <>
            <h1>PERFIL</h1>
        </>
    )

}

export default ProfilePage;