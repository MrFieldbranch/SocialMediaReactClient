
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

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn && <Header setIsLoggedIn={setIsLoggedIn} />}
      <Routes>
        <Route path="/" element={<Navigate to="/start" />} />
        <Route path='/start' element={<StartView />} />
        <Route path='/login' element={<LoginView setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='registernewuser' element={<RegisterNewUserView setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='myprofile' element={<MyProfileView />} />
        <Route path='myfriends' element={<MyFriendsView />} />
        <Route path='user' element={<UserView />} />
        <Route path='conversation' element={<ConversationView />} />
        <Route path='strangers' element={<StrangersView />}>
          <Route path='sorted' element={<StrangersSortedView />} />
        </Route>
        <Route path='friendrequests' element={<AllFriendRequestsView />}>
          <Route path='tome' element={<FriendRequestsToMeView />} />
          <Route path='fromme' element={<FriendRequestsFromMeView />} />
        </Route>
        <Route path='interests' element={<AllInterestsView />}>
          <Route path='myinterests' element={<MyInterestsView />} />
          <Route path='notmyinterests' element={<InterestsIDontHaveView />} />
        </Route>
        <Route path='publicboard' element={<PublicBoardView />} />
      </Routes>
    </>
  );
};

export default App;
