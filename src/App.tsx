import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import StartView from "./views/StartView";
import LoginView from "./views/LoginView";
import RegisterNewUserView from "./views/RegisterNewUserView";
import MyProfileView from "./views/MyProfileView";
import MyFriendsView from "./views/MyFriendsView";
import UserView from "./views/UserView";
import ConversationView from "./views/ConversationView";
import StrangersView from "./views/StrangersView";
import AllFriendRequestsView from "./views/AllFriendRequestsView";
import InterestsView from "./views/InterestsView";
import PublicBoardView from "./views/PublicBoardView";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import socialMediaApiService from "./services/social-media-api-service"; /* Singleton */
import NotFoundView from "./views/NotFoundView";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      socialMediaApiService.setAuthorizationHeader(token);
      setIsLoggedIn(true);
      navigate("/myprofile");
    }
  }, []);  

  return (
    <div className="main-container">
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path="/start" element={<StartView />} />
        <Route path="/login" element={<LoginView setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/registernewuser" element={<RegisterNewUserView setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/myprofile"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <MyProfileView />
            </PrivateRoute>
          }
        />
        <Route
          path="/myfriends"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <MyFriendsView />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <UserView />
            </PrivateRoute>
          }
        />
        <Route
          path="/conversation/:id"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <ConversationView />
            </PrivateRoute>
          }
        />
        <Route
          path="/strangers/*"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <StrangersView />
            </PrivateRoute>
          }
        />
        <Route
          path="/friendrequests"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AllFriendRequestsView />
            </PrivateRoute>
          }
        />
        <Route
          path="/interests/*"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <InterestsView />
            </PrivateRoute>
          }
        />
        <Route
          path="/publicboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PublicBoardView />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFoundView isLoggedIn={isLoggedIn} />} />
      </Routes>
    </div>
  );
};

export default App;
