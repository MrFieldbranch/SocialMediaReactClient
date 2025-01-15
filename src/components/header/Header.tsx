import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate('/start');
    };

    return (
        <nav>            
            <Link to='/myprofile'>Min profil</Link>
            <Link to='/myfriends'>Mina vänner</Link>
            <Link to='/strangers'>Möjliga vänner</Link>            
            <Link to='/friendrequests'>Aktuella vänförfrågningar</Link>
            <Link to='/interests'>Intressen</Link>
            <Link to='/publicboard'>Anslagstavlan</Link>
            <button onClick={handleLogout}>Logga ut</button>
        </nav>
    );
};

export default Header;