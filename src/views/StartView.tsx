import { useNavigate } from "react-router-dom";
import { quotes } from "../constants/quotes";
import { newsReportQuote } from "../constants/quotes";

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
      <div className="review-and-news-report">
        <div className="review-section">
          <div className="review-star-container">
            <div className="star-image" />
            <div className="star-image" />
            <div className="star-image" />
            <div className="star-image" />
            <div className="star-image" />
          </div>
          <p>Högsta betyg på Google Play Store </p>
        </div>
        <div className="news-report-section">
          <h2>Årets app 2025</h2>
          <p>{newsReportQuote}</p>
		  <p>-</p>
		  <p>SweClockers</p>
        </div>
      </div>
    </div>
  );
};

export default StartView;
