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
import AllInterestsView from "./views/AllInterestsView";
import PublicBoardView from "./views/PublicBoardView";
/* import StrangersSortedView from "./views/StrangersSortedView"; */
import MyInterestsView from "./views/MyInterestsView";
import InterestsIDontHaveView from "./views/InterestsIDontHaveView";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import PrivateRoute from "./components/PrivateRoute";
import socialMediaApiService from "./services/social-media-api-service"; /* Singleton */

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
    <>
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route 
			path="/" 
			element={<Navigate to="/start" />} 
		/>
        <Route 
			path="/start" 
			element={<StartView />} 
		/>
        <Route 
			path="/login" 
			element={<LoginView setIsLoggedIn={setIsLoggedIn} />} 
		/>
        <Route 
			path="/registernewuser" 
			element={<RegisterNewUserView setIsLoggedIn={setIsLoggedIn} />} 
		/>
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
        {/* <Route
          path="/strangers"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <StrangersView />
            </PrivateRoute>
          }
        >
          <Route
            path="sorted"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <StrangersSortedView />
              </PrivateRoute>
            }
          />
        </Route> */}
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
          path="/interests"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <AllInterestsView />
            </PrivateRoute>
          }
        >
          <Route
            path="myinterests"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <MyInterestsView />
              </PrivateRoute>
            }
          />
          <Route
            path="notmyinterests"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <InterestsIDontHaveView />
              </PrivateRoute>
            }
          />
        </Route>
        <Route
          path="/publicboard"
          element={
            <PrivateRoute isLoggedIn={isLoggedIn}>
              <PublicBoardView />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
