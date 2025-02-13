import { Link } from "react-router-dom";

const NotFoundView = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
	const destination = isLoggedIn ? "/myprofile" : "/start";
	return (
    <div className="not-found-view">
      <h2>Tyvärr</h2>
      <p>Denna sida kan inte hittas</p>
      <Link to={destination}>Tillbaka</Link>
    </div>
  );
};

export default NotFoundView;