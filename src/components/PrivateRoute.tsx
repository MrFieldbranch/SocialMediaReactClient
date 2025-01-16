import { Navigate } from "react-router-dom";

const PrivateRoute = ({ isLoggedIn, children }: { isLoggedIn: boolean; children: JSX.Element }) => {
    return isLoggedIn ? children : <Navigate to="/start" />
};

export default PrivateRoute;