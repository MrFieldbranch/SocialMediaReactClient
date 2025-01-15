import { useNavigate } from 'react-router-dom';
import './StartView.css';

const StartView = () => {
    const navigate = useNavigate();

    const goToLoginView = () => {
        navigate('/login');
    };

    const goToRegisterNewUserView = () => {
        navigate('/registernewuser');
    };   

    return (
        <>
            <h1>StartView</h1>
            <button onClick={goToLoginView}>Go To LoginView</button>
            <button onClick={goToRegisterNewUserView}>Go To RegisterNewUserView</button>
        </>

    );
};

export default StartView;