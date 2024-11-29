import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
//import Login from "./Login"
//import './Nav.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Nav() {
  const [token, setToken] = useState("");
  const [colapseMenu, setColapseMenu] = useState(false);

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       const token = localStorage.getItem("token");
//       setToken(token);

//       const userId = jwtDecode(token).id;

//       const getUserData = async () => {
//         const userResponse = await axios.get(`https://gamefeed-back.onrender.com/api/users/${userId}/`);
//         const newUser = userResponse.data;
//         setUser(newUser);
//       };

//       getUserData();
//     }
//   }, [token]);

//   useEffect(() => {
//     setToken(localStorage.getItem("token"));
//   }, [user]);

  const responsiveMenu = (e) => {
    return (
      <ul className="nav--colapsedMenuWrap">
        <p>MENU</p>
        <li><Link to="/addGame" onClick={() => setColapseMenu(false)}>Añadir juego</Link></li>
        <li><Link to="/profile" onClick={() => setColapseMenu(false)}>Perfil</Link></li>
        <li><Link to="/register" onClick={() => setColapseMenu(false)}>Registrarse</Link></li>
      </ul>
    )
  }

  return (
    <nav className={"nav"}>
      {colapseMenu && <div className="nav--responsiveMenuWrap" onClick={() => setColapseMenu(false)}>{responsiveMenu()}</div>}
      <h1 className={"nav--webTittle"}>COMMISION ARTE</h1>
      <div className={"nav--navWrap"}>
        <ul className={"nav--linkWrap"}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/upload" onClick={() => setColapseMenu(false)}>Subir Imagenes</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav