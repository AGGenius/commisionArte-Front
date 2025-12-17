import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import ExpandIcon from "../../assets/icons/expand_111060.svg?react";
import axios from 'axios';
import './PersonalGallery.css';

const PersonalGalleryPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const navigate = useNavigate();
    const [mainImage, setMainImage] = useState();
    const [imageSet, setImageSet] = useState([]);
    const [imageSize, setImageSize] = useState(false);
    const [activeImages, setActiveImages] = useState([]);

    //Redirect for unauthorized access
    useEffect(() => {
        setToken(localStorage.getItem("token"));
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        getMyImages();
    }, [user])

    const getMyImages = async () => {
        const artistId = user.id;

        if (!artistId) {
            return;
        }

        try {
            const imageUrl = `http://localhost:3000/api/portfolio/artist/`;
            const response = await axios.get(imageUrl + artistId);
            const data = response.data;
            setImageSet(data);

            console.log(data)

        } catch (error) {
            console.log(error);
        };
    };

    const getImage = async (image) => {
        const imageId = image.id;

        if (!imageSize) {
            try {
                const imageUrl = `http://localhost:3000/api/portfolio/`;
                const response = await axios.get(imageUrl + imageId);
                const data = response.data;

                setMainImage(data);
                setImageSize(true);
            } catch (error) {
            };
        } else {
            setMainImage("");
            setImageSize(false);
        };
    };

    const activateResizeButton = async (image) => {
        setActiveImages(prev =>
            prev.includes(image.id)
                ? prev.filter(x => x !== image.id)
                : [...prev, image.id]
        );
    };

    const checkSFW = async (e, image) => {
        if (image.sfw_status) { return }
        if (!token) { return };
        if (user.sfw_status === true) { return };



        console.log(1)

        activateResizeButton(image);

        if (e.target.className === "blur personalGallery__imgContainer--baseImage") {
            e.target.className = "plain frontPage__imgContainer--baseImage";
            e.target.src = image.location;
        } else {
            e.target.className = "blur personalGallery__imgContainer--baseImage";
            e.target.src = image.blurred_location;
        };
    };

    const deleteImage = async (image) => {
        const imageId = image.id;


        const confirmation = await confirm("Confirma para borrar el usuario");
        if (confirmation) {
            try {
                const imageUrl = `http://localhost:3000/api/portfolio/`;
                await axios.delete(imageUrl + imageId);

                getMyImages();
            } catch (error) {
                //console.log(error);
            };
        };
    };

    return (
        <>
            <div className="personalGallery">
                <h1 className="personalGallery--title">Tu Galeria</h1>
                <div className="personalGallery__imageWrap">
                    {imageSet ? imageSet.map((image) =>
                    (
                        <div className="personalGallery__imgContainer" key={image.id}>
                            <button className="personalGallery--deleteButton" onClick={(e) => deleteImage(image)}>Borrar imagen</button>
                            <div className="personalGallery__imgContainer--data">
                                <p className="personalGallery__imgContainer--title">{image.name}</p>
                                <div className="personalGallery__imgContainer--stylesList">
                                    <p className="personalGallery__imgContainer--label">Estilos</p>
                                    <div className="personalGallery__imgContainer--styles--wrap">
                                        {image.styles.split(',').map((style, i) => (
                                            <span className="personalGallery__imgContainer--stylesList--item" key={i}>{style}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="personalGallery__imgContainer--imageWrap">
                                <img
                                    className={image.sfw_status ? "plain personalGallery__imgContainer--baseImage" : "blur personalGallery__imgContainer--baseImage"}
                                    src={image.sfw_status ? image.location : image.blurred_location}
                                    alt={'Picture ' + image.name + ' - ' + image.sfw_status}
                                    onClick={(e) => checkSFW(e, image)}
                                />
                                {activeImages.includes(image.id) && <div className="personalGallery__imgContainer--changeSizeButton" onClick={() => getImage(image)}>
                                    <ExpandIcon className="personalGallery__imgContainer--changeSizeButton--icon" />
                                </div>}
                                {image.sfw_status && <div className="personalGallery__imgContainer--changeSizeButton" onClick={() => getImage(image)}>
                                    <ExpandIcon className="personalGallery__imgContainer--changeSizeButton--icon" />
                                </div>}
                            </div>
                        </div>
                    ))
                        : <p>Sin imagenes subidas</p>
                    }
                    {imageSize &&
                        <>
                            <div className="personalGallery__fullImage" key={mainImage.id} onClick={() => getImage(mainImage)}>
                                <div className="personalGallery__fullImage--data" >
                                    <p className="personalGallery__fullImage--name">Titulo: {mainImage.name}</p>
                                </div>
                                <div className="personalGallery__fullImage--imageContainer">
                                    <img
                                        className={"plain personalGallery__fullImage--image"}
                                        src={mainImage.location}
                                        alt={'Picture ' + mainImage.name}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
                <Link to="/upload" className="personalGallery--navButton">Subir imagen</Link>
            </div>
        </>
    )

}

export default PersonalGalleryPage;