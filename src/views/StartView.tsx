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
    <div className="start">
      <h1>Joelbook</h1>
      <button onClick={goToLoginView}>Logga in</button>
      <button onClick={goToRegisterNewUserView}>Registrera dig</button>
    </div>
  );
};

export default StartView;
