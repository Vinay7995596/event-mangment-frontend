import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
const Loginpage = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPasword] = useState("");
  const [email, setEmail] = useState("");
  const [sign, setSignIn] = useState(false);
  const [conformPassword, setConformPassword] = useState("");
  const [passwordError, setErrorPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const usernameChange = (e) => {
    setUserName(e.target.value);
  };
  const passowrdChange = (e) => {
    setPasword(e.target.value);
  };

  const conformPassswordHandle = (e) => {
    setConformPassword(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const signHandle = () => {
    setSignIn(!sign);
  };

  const submitDetails = async () => {
    try {
      if (password === conformPassword) {
        const payload = {
          email,
          username,
          password,
        };
        const response = await axios.post(
          "https://event-managment-hfd8.onrender.com/api/register",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        if (response) {
          console.log(response);
        }
      } else {
        setErrorPassword(!passwordError);
      }
    } catch (e) {
      console.log("error in sending backend", e);
    }
  };

  const loginDetails = async () => {
    try {
      const payload = {
        email,
        password,
      };
      const response = await axios.post(
        "https://event-managment-hfd8.onrender.com/api/login",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        navigate("/home");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
      }
    } catch (e) {
      console.log("error in sending backend", e);
    }
  };

  const guestButton = () => {
    navigate("/home");
  };
  return (
    <>
      <div className="main-bg-conteiner-login">
        <div className="login-container">
          <h5 className="heading">Login</h5>
          {sign && (
            <div className="input-container">
              <input
                required
                type="text"
                placeholder="User Name"
                className="inputs"
                onChange={usernameChange}
              />
            </div>
          )}
          <div style={{ textAlign: "left" }}>
            <div className="input-container">
              <input
                required
                type="email"
                placeholder="Email"
                className="inputs"
                onChange={handleEmail}
              />
            </div>
            <span className="error-message">
              {emailError && "Email is required"}
            </span>
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="input-container">
              <input
                type="password"
                placeholder="Enter password"
                className="inputs"
                onChange={passowrdChange}
              />
            </div>
            <span className="error-message">
              {passwordError && "Password is required"}
            </span>
          </div>
          <div style={{ textAlign: "left" }}>
            {sign && (
              <div className="input-container">
                <input
                  type="password"
                  placeholder="Conform password"
                  className="inputs"
                  onChange={conformPassswordHandle}
                />
              </div>
            )}
            <span className="error-message">
              {passwordError && "pasword is not matching"}
            </span>
          </div>

          <div className="buttons-conteiner">
            <button className="submit-button" onClick={signHandle}>
              {sign ? "Sign In" : "Sign Up"}
            </button>
            <button
              className="signin-button"
              onClick={sign ? submitDetails : loginDetails}
            >
              Submit
            </button>
            <button className="guest-button" onClick={guestButton}>
              Guest
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loginpage;
