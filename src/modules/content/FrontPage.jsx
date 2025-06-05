import { useEffect, useState } from "react";
import Blur from "react-blur";
import axios from 'axios';
import { useUserContext } from "../../context/useUserContext";
import './FrontPage.css'

const FrontPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const [mainImage, setMainImage] = useState();
    const [imageSet, setImageSet] = useState([]);

    useEffect(() => {
        getAllImages();
    }, [])

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

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
        const logedStatus = !!localStorage.getItem("token");

        try {
            const imageUrl = `http://localhost:3000/api/portfolio?logedStatus=${logedStatus}`;
            const response = await axios.get(imageUrl);
            const data = response.data;
            setImageSet(data);
        } catch (error) {
            //console.log(error);
        };
    };

    const checkSFW = async (e, image) => {
        if (image.sfw_status) { return }

        if (user.sfw_status === false && e.target.className === "blur") {
            e.target.className = "plain";
            e.target.src = image.location;
        } else {
            e.target.className = "blur";
            e.target.src = image.blurred_location;
        }
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
                            <div className="img__container"><img
                                className={image.sfw_status ? "plain" : "blur"}
                                src={image.sfw_status ? image.location : image.blurred_location}
                                alt={'Picture ' + image.name + ' - ' + image.sfw_status}
                                onClick={(e) => checkSFW(e, image)} /></div>
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