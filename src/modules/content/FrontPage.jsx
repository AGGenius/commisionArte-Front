import { useEffect, useState } from "react";
import API_URL from "../../config/api";
import axios from 'axios';
import { useUserContext } from "../../context/useUserContext";
import ExpandIcon from "../../assets/icons/expand_111060.svg?react";
import './FrontPage.css'

const FrontPage = () => {
    const { user, setUser } = useUserContext();
    const [token, setToken] = useState("");

    const [mainImage, setMainImage] = useState();
    const [imageSet, setImageSet] = useState([]);
    const [imageSize, setImageSize] = useState(false);
    const [activeImages, setActiveImages] = useState([]);

    const [artistCache, setArtistCache] = useState({});
    const [tooltip, setTooltip] = useState({ text: "", x: 0, y: 0, active: false });

    useEffect(() => {
        getAllImages();
    }, [])

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);


    const getArtistName = async (artistId) => {
        if (artistCache[artistId]) return artistCache[artistId];


        const artistNameUrl = `${API_URL}/api/artists/artistname/`;

        const response = await axios.get(artistNameUrl + artistId);
        const data = response.data;
        const artistName = data.name || "Unknown";

        setArtistCache((prev) => ({ ...prev, [artistId]: artistName }));
        return artistName;
    };

    const getImage = async (image) => {
        const imageId = image.id;

        if (!imageSize) {
            try {
                const imageUrl = `${API_URL}/api/portfolio/`;
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

    const getAllImages = async () => {
        const logedStatus = !!localStorage.getItem("token");

        try {
            const imageUrl = `${API_URL}/api/portfolio?logedStatus=${logedStatus}`;
            const response = await axios.get(imageUrl);
            const data = response.data;
            setImageSet(data);
        } catch (error) {
        };
    };

    const checkSFW = async (e, image) => {
        if (image.sfw_status) { return }
        if (!token) { return };
        if (user.sfw_status === true) { return };

        activateResizeButton(image);

        if (e.target.className === "blur frontPage__imgContainer--baseImage") {
            e.target.className = "plain frontPage__imgContainer--baseImage";
            e.target.src = image.location;
            handleMouseEnter(e, image, true);
        } else {
            e.target.className = "blur frontPage__imgContainer--baseImage";
            e.target.src = image.blurred_location;
            handleMouseLeave();
        };
    };

    const activateResizeButton = async (image) => {
        setActiveImages(prev =>
            prev.includes(image.id)
                ? prev.filter(x => x !== image.id)
                : [...prev, image.id]
        );
    };

    const handleMouseEnter = async (e, image, imageSfwActualStatus) => {
        if (!image.sfw_status && !imageSfwActualStatus) { return }
        if (user.sfw_status === true) { return };

        const name = await getArtistName(image.artist_id);
        const rect = e.target.getBoundingClientRect();

        setTooltip({
            text: 'Creada por: ' + name,
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            active: true
        });
    };

    const handleMouseLeave = () => {
        setTooltip((prev) => ({ ...prev, active: false }));
    };

    return (
        <>
            <div className="frontPage">
                <h1 className="frontPage--title">GALERIA PRINCIPAL</h1>
                <div className="frontPage__imageWrap">
                    {imageSet ? imageSet.map((image) =>
                    (
                        <div className="frontPage__imgContainer" key={image.id}>
                            <div className="frontPage__imgContainer--data">
                                <p className="frontPage__imgContainer--title">{image.name}</p>
                                <div className="frontPage__imgContainer--stylesList">
                                    <p className="frontPage__imgContainer--label">Estilos</p>
                                    <div className="frontPage__imgContainer--styles--wrap">
                                        {image.styles.split(',').map((style, i) => (
                                            <span className="frontPage__imgContainer--stylesList--item" key={i}>{style}</span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            <div className="frontPage__imgContainer--imageWrap">
                                <img
                                    className={image.sfw_status ? "plain frontPage__imgContainer--baseImage" : "blur frontPage__imgContainer--baseImage"}
                                    src={image.sfw_status ? image.location : image.blurred_location}
                                    alt={'Picture ' + image.name + ' - ' + image.sfw_status}
                                    onClick={(e) => checkSFW(e, image)}
                                    onMouseEnter={(e) => handleMouseEnter(e, image, activeImages.includes(image.id))}
                                    onMouseLeave={handleMouseLeave}
                                />
                                {activeImages.includes(image.id) && <div className="frontPage__imgContainer--changeSizeButton" onClick={() => getImage(image)}>
                                    <ExpandIcon className="frontPage__imgContainer--changeSizeButton--icon" />
                                </div>}
                                {image.sfw_status && <div className="frontPage__imgContainer--changeSizeButton" onClick={() => getImage(image)}>
                                    <ExpandIcon className="frontPage__imgContainer--changeSizeButton--icon" />
                                </div>}
                            </div>
                        </div>
                    ))
                        : <p>Cargando datos...</p>
                    }
                    {imageSize &&
                        <>
                            <div className="frontPage__fullImage" key={mainImage.id} onClick={() => getImage(mainImage)}>
                                <div className="frontPage__fullImage--data" >
                                    <p className="frontPage__fullImage--name">Titulo: {mainImage.name}</p>
                                </div>
                                <div className="frontPage__fullImage--imageContainer">
                                    <img
                                        className={"plain frontPage__fullImage--image"}
                                        src={mainImage.location}
                                        alt={'Picture ' + mainImage.name}
                                    />
                                </div>
                            </div>
                        </>
                    }
                    {tooltip.active && (
                        <div
                            className="frontPage__tooltip"
                            style={{ "--top": tooltip.y + "px", "--left": tooltip.x + "px" }}
                        >
                            {tooltip.text}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
};

export default FrontPage;