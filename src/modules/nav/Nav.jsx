import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import LoginIcon from "../../assets/icons/login_icon_137429.svg?react";
import LogoutIcon from "../../assets/icons/logout_icon_138409.svg?react";
import Login from "./Login"
import './Nav.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Nav() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const [token, setToken] = useState("");
  const [loginWindow, setLoginWindow] = useState(false);
  const newRef = useRef(null);
  const loginRef = useRef(null);
  const apiArtistURL = "http://localhost:3000/api/artists/";
  const apiClientURL = "http://localhost:3000/api/clients/";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      setToken(token);

      const userId = jwtDecode(token).id;
      const userType = jwtDecode(token).type;

      const getUserData = async () => {
        let url;

        if (userType === "client") {
          url = apiClientURL;
        } else {
          url = apiArtistURL;
        }
        const userResponse = await axios.get(`${url}${userId}/`);

        const newUser = userResponse.data;
        setUser(newUser);
      };

      getUserData();
    }
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setLoginWindow(false);
  }, [user]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (e) => {
    if (newRef.current && !newRef.current.contains(e.target)) {
      setLoginWindow(false);
    }
  };

  const logOut = () => {
    localStorage.removeItem("token");
    setUser({});
    navigate("/");
    window.location.reload();
  };

  const clientMenu = (e) => {
    return (
      <ul className="nav__menu">
        {token && <li><Link to="/offers" className="nav__navButton first">Solicitudes</Link></li>}
        {token && <li><Link to="/profile" className="nav__navButton">Perfil</Link></li>}
        {token && <li><Link to="/stateCard" className="nav__navButton last">Tarjetas de trabajo</Link></li>}
      </ul>
    )
  }

  const artistMenu = (e) => {
    return (
      <ul className="nav__menu">
        {token && <li className="nav__navListElement"><Link to="/offers" className="nav__navButton first">Trabajos</Link></li>}
        {token && <li className="nav__navListElement"><Link to="/personalGallery" className="nav__navButton">Mi galeria</Link></li>}
        {token && <li className="nav__navListElement"><Link to="/profile" className="nav__navButton">Perfil</Link></li>}
        {token && <li className="nav__navListElement"><Link to="/stateCard" className="nav__navButton last">Tarjetas de trabajo</Link></li>}
      </ul>
    )
  }

  return (
    <nav className={"nav"} ref={newRef}>
      <Link to="/" className={"nav__webTittle"}><p className={"nav__webTittle--text"}>COMMISION ART</p></Link>
      {token && user.account_type === "client" ? clientMenu() : artistMenu()}
      {!token && <div className="nav__loginWindow" onClick={() => setLoginWindow(!loginWindow)}>
        <LoginIcon className="nav__loginWindow--loginIcon" />
      </div>}
      {token && <div className="nav__loginWindow" onClick={() => logOut()}>
        <LogoutIcon className="nav__loginWindow--logoutIcon" />
      </div>}
      {loginWindow && !token && <Login />}
      <div className={loginWindow ? "nav--obscured" : "nav--base"} onClick={() => setLoginWindow(!loginWindow)}></div>
    </nav>
  );
};

export default Nav