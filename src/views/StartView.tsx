import { useNavigate } from "react-router-dom";
import { quotes } from "../constants/quotes";

const StartView = () => {
  const navigate = useNavigate();

  const goToLoginView = () => {
    navigate("/login");
  };

  const goToRegisterNewUserView = () => {
    navigate("/registernewuser");
  };

  return (
    <div className="start">
      <div className="start-upper">
        <h1>Joelbook</h1>
        <button id="start-register" onClick={goToRegisterNewUserView}>
          Registrera dig
        </button>
        <button onClick={goToLoginView}>Logga in</button>
      </div>
      <div className="start-image-container" />
      <div className="quote-container">
        {quotes.map((quote, index) => (
          <p key={index} className="quote" style={{ animationDelay: `${index * 6}s` }}>
            {quote}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StartView;
