import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ILoginRequest } from "../models/ILoginRequest";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { jwtDecode } from "jwt-decode";

const LoginView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void; }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

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


  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="login-view">
      <h1>LOGGA IN</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Lösenord:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>        
        <button type="submit">Logga in</button>
      </form>
    </div>
  );
};

export default LoginView;
