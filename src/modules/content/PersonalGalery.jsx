import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';

const PersonalGalleryPage = () => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const [imageSet, setImageSet] = useState([]);

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        getMyImages();
    }, [user])

    const getMyImages = async () => {
        const artistId = user.id;

        if(!artistId) {
            return;
        }

        try {
            const imageUrl = `http://localhost:3000/api/portfolio/artist/`;
            const response = await axios.get(imageUrl + artistId);
            const data = response.data;
            setImageSet(data);

        } catch (error) {
            console.log(error);
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

    const deleteImage = async (image) => {
        const imageId = image.id;

        try {
            const imageUrl = `http://localhost:3000/api/portfolio/`;
            await axios.delete(imageUrl + imageId);

            getMyImages();
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <>
            <h1>Mi Galeria</h1>
            <div>
                {imageSet.length > 0 ? imageSet.map((image) =>
                (
                    <div className="games--gameCard" key={image.id}>
                        <div className="games--gameCardData">
                            <p>Nombre: {image.name}</p>
                            <p>Estilos: <span>{image.styles}</span></p>
                            <div className="img__container"><img
                                className={image.sfw_status ? "plain" : "blur"}
                                src={image.sfw_status ? image.location : image.blurred_location}
                                alt={'Picture ' + image.name + ' - ' + image.sfw_status}
                                onClick={(e) => checkSFW(e, image)} />
                            </div>
                            <button onClick={(e) => deleteImage(image)}>Borrar imagen</button>
                        </div>
                    </div>
                ))
                    : <p>Sin imagenes subidas</p>
                }
            </div>
            <Link to="/upload" className="nav--navButton">Subir imagen</Link>
        </>
    )

}

export default PersonalGalleryPage;