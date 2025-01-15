import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useUserContext } from "../../context/useUserContext";
import axios from 'axios';
//import './AddGame.css'

//Module to control the creation of new games.
const UploadImage = () => {
    const { user, setUser } = useUserContext();
    const [active, setActive] = useState(false);
    const [token, setToken] = useState("");
    const [createStatus, setCreateStatus] = useState("");
    const addImageURL = "http://localhost:3000/api/portfolio/upload";
    const navigate = useNavigate();

    //Redirect for unauthorized access
    useEffect(() => {
        if (!localStorage.getItem("token")) { navigate("/"); }
    }, []);

    useEffect(() => {
        setToken(localStorage.getItem("token"));
    }, [user]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: "", artist_id: "", styles: "", sfw_status: ""
        }
    });

    //Function to send the form data to the back-end if all inputs are validated. Gives a custom response from the back-end on successful or unsuccessful events.
    const uploadImage = async (data) => {

        if (data) {
            const formData = new FormData();

            if (!token) { return };
            
            const user_id = user.id;

            formData.append("name", data.name)
            formData.append("artist_id", user_id)
            formData.append("styles", data.styles)
            formData.append("sfw_status", data.sfw_status)
            formData.append("file", data.file[0])

            const config = { headers: { 'Content-Type': 'multipart/form-data' } }

            try {
                const response = await axios.post(addImageURL, formData, config);

                console.log(response)
                setCreateStatus(response.data.estado);
            } catch (error) {
                const errors = error.response.data.errors;

                errors.map((error) => {
                    if (error.path == "tittle" && error.msg === `The game  ${data.tittle} already exists.`) {
                        setCreateStatus("El juego que se intenta añadir ya existe.");
                    };
                });
            };
        };
    };

    return (
        <div className="addGame">
            <h2 className="addGame--tittle">Sube una imagen</h2>
            <form className="addGame--form" onSubmit={handleSubmit((data) => uploadImage(data))}>
                <label htmlFor="createGameTittle">Titulo</label>
                <input id="createGameTittle" type="text" {...register("name", { required: { value: true, message: "Se debe introducir el titulo." } })}></input>
                {errors.tittle?.message && <p className="addGame--formError">{errors.tittle?.message}</p>}
                <label htmlFor="createGameDevelopa">Estilos</label>
                <input id="createGameDevelopa" type="text" {...register("styles", { required: { value: true, message: "Se debe introducir estilos." } })}></input>
                {errors.developer?.message && <p className="addGame--formError">{errors.developer?.message}</p>}
                <label htmlFor="createGameDevelopa">SFW</label>
                <input id="editUserState" type="checkbox" {...register("sfw_status")} value={active ? active : false} checked={active ? active : false} onChange={(e) => setActive(e.target.checked)}></input>
                {errors.developer?.message && <p className="addGame--formError">{errors.developer?.message}</p>}
                <label htmlFor="createGameRelease">Archivo</label>
                <input id="createGameRelease" type="file" {...register("file", { required: { value: true, message: "Se debe seleccionar un archivo para subir." } })}></input>
                {errors.release?.message && <p className="addGame--formError">{errors.release?.message}</p>}
                <button className="addGame--formButton" type="submit">Subir imagen</button>
            </form>
            {createStatus && <p>{createStatus}</p>}
        </div>
    )
}

export default UploadImage;