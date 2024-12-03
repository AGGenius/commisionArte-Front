import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import { useUserContext } from "../../context/useUserContext";
import { jwtDecode } from "jwt-decode";
import Login from "./Login"
import './Nav.css'

//Module to generate the navigation for the webpage. This changes if for logged users as for the type of user that is logged.
function Nav() {
  const { user, setUser } = useUserContext();
  const [token, setToken] = useState("");
  const [loginWindow, setLoginWindow] = useState(false);
  const newRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      setToken(token);

      const userId = jwtDecode(token).id;

      const getUserData = async () => {
        const userResponse = await axios.get(`https://gamefeed-back.onrender.com/api/users/${userId}/`);
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

  return (
    <nav className={"nav"} ref={newRef}>
      <Link to="/"><p className={"nav--webTittle"}>COMMISION ARTE</p></Link>
      {!token && <button className="nav--loginWindow" onClick={() => setLoginWindow(!loginWindow)}>LOGIN/REGISTER</button>}
      {token && <button className="nav--loginWindow" onClick={() => logOut()}>LOGOUT</button>}
      {loginWindow && !token && <Login />}
    </nav>
  );
};

export default Nav