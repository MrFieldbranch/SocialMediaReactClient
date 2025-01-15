import { useNavigate } from 'react-router-dom';
import './RegisterNewUserView.css';

const RegisterNewUserView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
    const navigate = useNavigate();

    const handleRegisterAndLogin = () => {
        // simulate register and login process
        setIsLoggedIn(true);
        goToMyProfileView();
    };

    const goToMyProfileView = () => {
        navigate('/myprofile');
    };

    return (
        <>
            <h1>RegisterNewUserView</h1>
            <button onClick={handleRegisterAndLogin}>Register and Log in</button>
        </>

    );
};

export default RegisterNewUserView;