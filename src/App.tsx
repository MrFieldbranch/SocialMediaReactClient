
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css'
import StartView from './views/start-view/StartView';
import LoginView from './views/login-view/LoginView';
import RegisterNewUserView from './views/register-new-user-view/RegisterNewUserView';
import MyProfileView from './views/my-profile-view/MyProfileView';
import MyFriendsView from './views/my-friends-view/MyFriendsView';
import UserView from './views/user-view/UserView';
import ConversationView from './views/conversation-view/ConversationView';
import StrangersView from './views/strangers-view/StrangersView';
import AllFriendRequestsView from './views/all-friend-requests-view/AllFriendRequestsView';
import AllInterestsView from './views/all-interests-view/AllInterestsView';
import PublicBoardView from './views/public-board-view/PublicBoardView';
import StrangersSortedView from './views/strangers-sorted-view/StrangersSortedView';
import FriendRequestsToMeView from './views/friend-requests-to-me-view/FriendRequestsToMeView';
import FriendRequestsFromMeView from './views/friend-requests-from-me-view/FriendRequestsFromMeView';
import MyInterestsView from './views/my-interests-view/MyInterestsView';
import InterestsIDontHaveView from './views/interests-i-dont-have-view/InterestsIDontHaveView';
import Header from './components/header/Header';
import { useState } from 'react';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path='/start' element={<StartView />} />
        <Route path='/login' element={<LoginView setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/registernewuser' element={<RegisterNewUserView setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/myprofile" element={<PrivateRoute isLoggedIn={isLoggedIn}><MyProfileView /></PrivateRoute>} />
        <Route path="/myfriends" element={<PrivateRoute isLoggedIn={isLoggedIn}><MyFriendsView /></PrivateRoute>} />
        <Route path="/user" element={<PrivateRoute isLoggedIn={isLoggedIn}><UserView /></PrivateRoute>} />
        <Route path="/conversation" element={<PrivateRoute isLoggedIn={isLoggedIn}><ConversationView /></PrivateRoute>} />
        <Route path="/strangers" element={<PrivateRoute isLoggedIn={isLoggedIn}><StrangersView /></PrivateRoute>}>
          <Route path='sorted' element={<PrivateRoute isLoggedIn={isLoggedIn}><StrangersSortedView /></PrivateRoute>} />
        </Route>
        <Route path='/friendrequests' element={<PrivateRoute isLoggedIn={isLoggedIn}><AllFriendRequestsView /></PrivateRoute>}>
          <Route path='tome' element={<PrivateRoute isLoggedIn={isLoggedIn}><FriendRequestsToMeView /></PrivateRoute>} />
          <Route path='fromme' element={<PrivateRoute isLoggedIn={isLoggedIn}><FriendRequestsFromMeView /></PrivateRoute>} />
        </Route>
        <Route path='/interests' element={<PrivateRoute isLoggedIn={isLoggedIn}><AllInterestsView /></PrivateRoute>}>
          <Route path='myinterests' element={<PrivateRoute isLoggedIn={isLoggedIn}><MyInterestsView /></PrivateRoute>} />
          <Route path='notmyinterests' element={<PrivateRoute isLoggedIn={isLoggedIn}><InterestsIDontHaveView /></PrivateRoute>} />
        </Route>
        <Route path="/publicboard" element={<PrivateRoute isLoggedIn={isLoggedIn}><PublicBoardView /></PrivateRoute>} />
      </Routes>
    </>
  );
};

export default App;
