import { useEffect, useState } from "react";
import { IBasicUserResponse } from "../models/IBasicUserResponse";
import BasicUser from "../components/BasicUser";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */

const MyFriendsView = () => {
  const [friends, setFriends] = useState<IBasicUserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchFriends = async () => {
      try {
        const response = await socialMediaApiService.getMyFriendsAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setFriends(response);
		  setError(null);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
        }
      } finally {
		setIsLoading(false);
	  }
    };

	fetchFriends();

	return () => abortCont.abort();
  }, []);

  const handleError = () => {
	setError(null);
  }

 if (error)
   return (
     <div className="error-message">
       <p>{error}</p>
       <button onClick={handleError}>Tillbaka</button>
     </div>
   );

  if (isLoading) {
    return <p>Laddar din vänlista...</p>;
  }

  return (
    <div className="my-friends">
      <h1>MINA VÄNNER</h1>

      {friends.length === 0 ? (
        <p className="mar-top-1">Du har inga vänner än. Gå till "Möjliga vänner" och skicka vänförfrågningar.</p>
      ) : (
        friends.map((friend: IBasicUserResponse) => (
          <BasicUser key={friend.id} id={friend.id} firstName={friend.firstName} lastName={friend.lastName} />
        ))
      )}
    </div>
  );
};

export default MyFriendsView;
