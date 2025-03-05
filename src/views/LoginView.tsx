import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ILoginRequest } from "../models/ILoginRequest";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { jwtDecode } from "jwt-decode";

const LoginView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      const loginRequest: ILoginRequest = { email, password };
      const loginResponse = await socialMediaApiService.loginAsync(loginRequest);
      localStorage.setItem("authToken", loginResponse.token);
      socialMediaApiService.setAuthorizationHeader(loginResponse.token);
      const decodedToken: any = jwtDecode(loginResponse.token);
      localStorage.setItem("userId", decodedToken.nameid);
      setIsLoggedIn(true);
      navigate("/myprofile");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const handleError = () => {
    setEmail("");
    setPassword("");
    setError(null);
  };

  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={handleError}>Tillbaka</button>
      </div>
    );

  return (
    <div className="box">
      <div className="login-or-register">
        <h1>LOGGA IN</h1>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Lösenord:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button onClick={() => handleLogin(email, password)}>Logga in</button>
      </div>
    </div>
  );
};

export default LoginView;
