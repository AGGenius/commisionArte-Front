import { useEffect, useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import Blur from "react-blur";
import axios from 'axios';

const PersonalGalleryPage = () => {
    const navigate = useNavigate();
    
    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    return (
        <>
            <h1>Mi Galeria</h1>
            <Link to="/upload" className="nav--navButton">Subir imagen</Link>
        </>
    )

}

export default PersonalGalleryPage;