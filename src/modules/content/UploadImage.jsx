import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the upload of new images.
const UploadImage = () => {
    const { user, setUser } = useUserContext();
    const [active, setActive] = useState(false);
    const [token, setToken] = useState("");
    const [createStatus, setCreateStatus] = useState("");
    const [selectedStyles, setSelectedStyles] = useState([]);
    const addImageURL = "http://localhost:3000/api/portfolio/upload";
    const navigate = useNavigate();

    const stylesArr = [
        "traditional",
        "digital",
        "realistic",
        "color",
        "lineart",
        "rendered",
        "sculpture",
        "plush",
        "full length portrait",
        "headshot",
        "adoptable",
        "ych",
        "reference sheet",
        "sticker"
    ];

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

    const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: "", artist_id: "", styles: "", sfw_status: false
        }
    });

    const handleSelectChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map(o => o.value);
        setSelectedStyles(selected);   // actualiza con todas las opciones seleccionadas
        setValue("styles", selected);  // sincroniza con React Hook Form
    };

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const uploadImage = async (data) => {
        
        if (data) {
            const formData = new FormData();

            if (!token) { return };

            if (data.file && data.file.length > 0) {
                formData.append("file", data.file[0]);
            } else {
                setCreateStatus("No hay archivo seleccionado.");
            };

            const user_id = user.id;

            formData.append("title", data.title)
            formData.append("artist_id", user_id)
            formData.append("styles", data.styles)
            formData.append("sfw_status", data.sfw_status)

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            try {
                const response = await axios.post(addImageURL, formData, config);

                reset();
                setSelectedStyles([]);
                setCreateStatus(response.data.estado);
            } catch (error) {
                setCreateStatus(error.response.data.error);
            };
        };
    };

    return (
        <div className="addImage">
            <h2 className="addImage--title">Sube una imagen</h2>
            <form className="addImage--form" onSubmit={handleSubmit((data) => uploadImage(data))}>
                <label htmlFor="createGametitle">Titulo</label>
                <input id="createGametitle" type="text" {...register("title", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                {errors.title?.message && <p className="addImage--formError">{errors.title?.message}</p>}
                <label htmlFor="createGameGenre">Estilos</label>
                <select id="createGameGenre" multiple value={selectedStyles} onChange={handleSelectChange}>
                    {stylesArr && stylesArr.sort().map((style, i) => (
                        <option key={i} value={style}>{style}</option>
                    ))}
                </select>
                <input type="text" readOnly {...register("styles", { required: { value: true , message: "Se debe introducir al menos un estilo." } })} placeholder="Tus estilos seleccionados aparecerán aquí" />
                {errors.styles?.message && <p className="addGame--formError">{errors.styles?.message}</p>}
                
                <label htmlFor="createGameDevelopa">SFW</label>
                <input id="editUserState" type="checkbox" {...register("sfw_status")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                {errors.sfw_status?.message && <p className="addImage--formError">{errors.sfw_status?.message}</p>}
                <label htmlFor="createGameRelease">Archivo</label>
                <input id="createGameRelease" type="file" {...register("file", { required: { value: true, message: "Se debe seleccionar un archivo para subir." } })} />
                {errors.file?.message && <p className="addImage--formError">{errors.file?.message}</p>}
                <button className="addImage--formButton" type="submit">Subir imagen</button>
            </form>
            {createStatus && <p>{createStatus}</p>}
        </div>
    )
}

export default UploadImage;