import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom"
import './Footer.css'

function Footer() {
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getWeatherReport();
    }, []);

    const getWeatherReport = () => {
        if (!navigator.geolocation) {
            setError("Geolocalización no soportada");
            return;
        };

        try {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;

                    const weatherURL = `http://localhost:3000/api/weather?lat=${latitude}&lon=${longitude}`;
                    const response = await axios.get(weatherURL);
                    const data = response.data;
                    setWeather(data);
                },
                () => {
                    setError("Permiso de ubicación denegado");
                }
            );
        } catch (error) {
            error => setError(error.message);
        };
    };

    const weatherReport = () => {
        if (error) return <p>{error}</p>;
        if (!weather) return <p>Cargando previsión...</p>;

        return (
            <div className="footer__weather-card">
                <h2 className="footer__weather-card--city">Tiempo en {weather.city}</h2>
                <p className="footer__weather-card--temperature">Temperatura: {weather.temperature}°C</p>
                <p className="footer__weather-card--feel">Sensación térmica: {weather.feels_like}°C</p>
            </div>
        );
    };

    return (
        <footer className="footer">
            {weatherReport()}
            <nav className="footer--nav">
                <Link className="footer--navLink" to="/terms" >Terminos de servicio</Link>
                <Link className="footer--navLink" to="/contact" >Contacto</Link>
            </nav>
            <p className="footer--sign">© 2025 by Adrian Giner Gimenez</p>
        </footer>
    );
};

export default Footer