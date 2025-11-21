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
    const [imageSize, setImageSize] = useState(false);
    const [activeImages, setActiveImages] = useState([]);

    useEffect(() => {
        getAllImages();
    }, [])

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

    const getImage = async (image) => {
        const imageId = image.id;

        if (!imageSize) {
            try {
                const imageUrl = `http://localhost:3000/api/portfolio/`;
                const response = await axios.get(imageUrl + imageId);
                const data = response.data;

                setMainImage(data);
                setImageSize(true);
                console.log(data);
            } catch (error) {
                //console.log(error);
            };
        } else {
            setMainImage("");
            setImageSize(false);
        }

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
        if (!token) { return };        
        if (user.sfw_status === true) { return };

        activateResizeButton(image);

        if (e.target.className === "blur baseImage") {
            e.target.className = "plain baseImage";
            e.target.src = image.location;
        } else {
            e.target.className = "blur baseImage";
            e.target.src = image.blurred_location;
        };
    };

    const activateResizeButton = async (image) => {
        setActiveImages(prev =>
            prev.includes(image.id)
                ? prev.filter(x => x !== image.id)
                : [...prev, image.id]
        );
    }

    return (
        <>
            <h1>PRIMERAS PRUEBAS</h1>
            <div className="mainPage">
                {imageSet ? imageSet.map((image) =>
                (
                    <div className="frontPage--image" key={image.id}>
                        <div className="frontPage--imageData">
                            <p>Titulo: {image.name}</p>
                            <p>Estilos:</p>
                            <div>
                                {image.styles.split(',').map((style, i) => (
                                    <span className="images--styles" key={i}>{style}</span>
                                ))}
                            </div>
                            <div className="img__container">
                                <img
                                    className={image.sfw_status ? "plain baseImage" : "blur baseImage"}
                                    src={image.sfw_status ? image.location : image.blurred_location}
                                    alt={'Picture ' + image.name + ' - ' + image.sfw_status}
                                    onClick={(e) => checkSFW(e, image)} />
                                {activeImages.includes(image.id) && <button className="img__changeSizeButton" onClick={() => getImage(image)}>Ampliar</button>}
                                {image.sfw_status && <button className="img__changeSizeButton" onClick={() => getImage(image)}>Ampliar</button>}
                            </div>
                        </div>
                    </div>
                ))
                    : <p>Cargando datos...</p>
                }
                {imageSize &&
                    <>
                        <div className="frontPage--fullImage" key={mainImage.id}>
                            <div className="frontPage--fullImageData" onClick={() => getImage(mainImage)}>
                                <p>Titulo: {mainImage.name}</p>
                                <div className="img__fullImageContainer">
                                    <img
                                        className={"plain img__fullImage"}
                                        src={mainImage.location}
                                        alt={'Picture ' + mainImage.name}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div>
        </>
    )

}

export default FrontPage;