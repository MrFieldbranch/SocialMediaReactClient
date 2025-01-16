import { useNavigate } from 'react-router-dom';
import './LoginView.css';
import { useState } from 'react';
import { SocialMediaApiService } from '../../services/social-media-api-service';
import { ILoginRequest } from '../../models/ILoginRequest';

const LoginView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const socialMediaApiService = new SocialMediaApiService("https://localhost:8000");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const loginRequest: ILoginRequest = { email, password };
            const loginResponse = await socialMediaApiService.loginAsync(loginRequest);
            socialMediaApiService.setAuthorizationHeader(loginResponse.token);
            setIsLoggedIn(true);
            navigate('/myprofile');
        } catch (error: any) {
            setErrorMessage(error.message || "An unknown error occurred.");
        }         
    };    

    return (
        <>
            <h1>Logga in</h1>
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
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Logga in</button>
            </form>
        </>
    );
};

export default LoginView;