import { useEffect, useState } from "react";
import Blur from "react-blur";
import axios from 'axios';
import './FrontPage.css'

const FrontPage = () => {
    const [mainImage, setMainImage] = useState();
    const [imageSet, setImageSet] = useState([]);

    useEffect(() => {
        getImage();
        getAllImages();
    }, [])

    const getImage = async () => {
        try {
            const imageUrl = `http://localhost:3000/api/portfolio/1`;
            const response = await axios.get(imageUrl);
            const data = response.data;
            setMainImage(data);
        } catch (error) {
            //console.log(error);
        };
    };

    const getAllImages = async () => {
        try {
            const imageUrl = `http://localhost:3000/api/portfolio/`;
            const response = await axios.get(imageUrl);
            const data = response.data;
            setImageSet(data);
        } catch (error) {
            //console.log(error);
        };
    };

    return (
        <>
            <h1>PRIMERAS PRUEBAS</h1>
            <div className="mainPage">
                {imageSet ? imageSet.map((image) =>
                (
                    <div className="games--gameCard" key={image.id}>
                        <div className="games--gameCardData">
                            <p>Nombre: {image.name}</p>
                            <p>Estilos: <span>{image.styles}</span></p>
                            <div className="img__container"><img className={image.sfw_status ? "plain" : "blur"} src={image.location} alt={'Picture ' + image.name + ' - ' + image.sfw_status} /></div>
                        </div>
                    </div>
                ))
                    : <p>Cargando datos...</p>
                }
            </div>
        </>
    )

}

export default FrontPage;