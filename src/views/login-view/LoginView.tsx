import { useNavigate } from 'react-router-dom';
import './LoginView.css';

const LoginView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        // simulate login process
        setIsLoggedIn(true);
        goToMyProfileView();
    };

    
    const goToMyProfileView = () => {
        navigate('/myprofile');
    };

    return (
        <>
            <h1>LoginView</h1>
            <button onClick={handleLogin}>Log in</button>
        </>
    );
};

export default LoginView;