import { useEffect, useState } from "react";
import { IBasicUserResponse } from "../models/IBasicUserResponse";
import BasicUser from "../components/BasicUser";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */

const MyFriendsView = () => {
  const [friends, setFriends] = useState<IBasicUserResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchFriends = async () => {
      try {
        const friendsFromApi = await socialMediaApiService.getMyFriendsAsync();
        if (isMounted) {
          setFriends(friendsFromApi);
        }
      } catch (error: any) {
        if (isMounted) {
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    };

    fetchFriends();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="my-friends-view">
      <h1>MINA VÄNNER</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {friends.length === 0 ? (
        <p>
          Du har inga vänner än. Gå till "Möjliga vänner" och skicka
          vänförfrågningar.
        </p>
      ) : (
        friends.map((friend) => (
          <BasicUser
            key={friend.id}
            id={friend.id}
            firstName={friend.firstName}
            lastName={friend.lastName}
          />
        ))
      )}
    </div>
  );
};

export default MyFriendsView;
