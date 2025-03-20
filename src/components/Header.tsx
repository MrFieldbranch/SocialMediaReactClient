import { Link, useNavigate } from "react-router-dom";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import hamburger from "../images/icons8-hamburger-menu-32.png";
import { useState } from "react";
import { navLinks } from "../constants/nav-links";

const Header = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    setIsHamburgerMenuOpen(false);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    socialMediaApiService.removeAuthorizationHeader();
    setIsLoggedIn(false);
    navigate("/start");
  };

  return (
    <nav>
      <h2>Joelbook</h2>
      <div className="nav-links">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path}>
            {link.label}
          </Link>
        ))}
      </div>
      <button onClick={handleLogout}>Logga ut</button>
      {!isHamburgerMenuOpen && <img src={hamburger} alt="Picture of hamburger menu" onClick={() => setIsHamburgerMenuOpen(true)} />}
      {isHamburgerMenuOpen && (
        <div className="hamburger-menu-open">
          <div className="button-to-the-right-hamburger">
            <button onClick={() => setIsHamburgerMenuOpen(false)}>Stäng meny</button>
          </div>
          <div className="mobile-view-links">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsHamburgerMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="button-to-the-right-hamburger" id="mobile-view-logout">
            <button onClick={handleLogout}>Logga ut</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
