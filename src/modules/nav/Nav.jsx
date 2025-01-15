import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"
import './Nav.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Nav() {
  const navigate = useNavigate();
  const { user, setUser } = useUserContext();
  const [token, setToken] = useState("");
  const [loginWindow, setLoginWindow] = useState(false);
  const newRef = useRef(null);
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

        if(userType === "client") {
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
  };

  const clientMenu = (e) => {
    return (
      <ul className="nav--menu">
        {token && <li><Link to="/" className="nav--navButton">Solicitudes</Link></li>}
        {token && <li><Link to="/profile" className="nav--navButton">Perfil</Link></li>}
      </ul>
    )
  }

  const artistMenu = (e) => {
    return (
      <ul className="nav--menu">
        {token && <li><Link to="/" className="nav--navButton">Trabajos</Link></li>}
        {token && <li><Link to="/personalGallery" className="nav--navButton">Mi galeria</Link></li>}
        {token && <li><Link to="/profile" className="nav--navButton">Perfil</Link></li>}
      </ul>
    )
  }

  return (
    <nav className={"nav"} ref={newRef}>
      <Link to="/"><p className={"nav--webTittle"}>COMMISION ARTE</p></Link>
      {token && user.acount_type === "client" ? clientMenu() : artistMenu()}
      {!token && <button className="nav--loginWindow" onClick={() => setLoginWindow(!loginWindow)}>LOGIN/REGISTER</button>}
      {token && <button className="nav--loginWindow" onClick={() => logOut()}>LOGOUT</button>}
      {loginWindow && !token && <Login />}
    </nav>
  );
};

export default Nav