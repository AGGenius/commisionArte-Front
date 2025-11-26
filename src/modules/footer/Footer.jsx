import { Link } from "react-router-dom"
import './Footer.css'

function Footer() {

    return (
        <footer className="footer">
            <nav className="footer--nav">
                <Link className="footer--navLink" to="/terms" >Terminos de servicio</Link>
                <Link className="footer--navLink" to="/contact" >Contacto</Link>
            </nav>
            <p className="footer--sign">© 2025 by Adrian Giner Gimenez</p>
        </footer>
    );
};

export default Footer