import { useEffect, useState } from "react";
import Blur from "react-blur";
import axios from 'axios';
import './FrontPage.css'

const FrontPage = () => {
    const [mainImage, setMainImage] = useState();

    useEffect(() => {
        getImage();
    }, [])

    const getImage = async () => {
        try {
            const imageUrl = `http://localhost:3000/api/portfolio/2`;
            const response = await axios.get(imageUrl);
            const data = response.data;
            setMainImage(data);
        } catch (error) {
            //console.log(error);
        };
    };

    return (
        <div>
            <h1>PRIMERAS PRUEBAS</h1>
            {mainImage ? <h2>Nombre: {mainImage.name}</h2> : <p>Espera un momento...</p>} 
            {mainImage ? <div className="img__container"><img className={mainImage.swf_status ?? "blur"} src={mainImage.location} alt="Imagen principal"/></div>  : <p>Cargando...</p>}   
            {mainImage ? <div className="img__container"><img className={!mainImage.swf_status ?? "blur"} src={mainImage.location} alt="Imagen principal"/></div>  : <p>Cargando...</p>}              
        </div>)

}

export default FrontPage;