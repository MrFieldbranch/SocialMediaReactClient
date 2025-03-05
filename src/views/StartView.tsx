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
    <div className="box">
      <div className="start-view">
        <h1>Joelbook</h1>
        <div className="start-view-choices">
          <button onClick={goToLoginView}>Logga in</button>
          <button onClick={goToRegisterNewUserView}>Registrera dig</button>
        </div>
      </div>
    </div>
  );
};

export default StartView;
