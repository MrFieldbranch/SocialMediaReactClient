import { useNavigate } from "react-router-dom";

const StartView = () => {
  const navigate = useNavigate();

  const goToLoginView = () => {
    navigate("/login");
  };

  const goToRegisterNewUserView = () => {
    navigate("/registernewuser");
  };

  return (
    <div className="start-view">
      <h1>StartView</h1>
      <button onClick={goToLoginView}>Go To LoginView</button>
      <button onClick={goToRegisterNewUserView}>Go To RegisterNewUserView</button>
    </div>
  );
};

export default StartView;
