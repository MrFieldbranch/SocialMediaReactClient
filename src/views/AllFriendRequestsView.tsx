import { useEffect, useState } from "react";
import { IPendingFriendResponse } from "../models/IPendingFriendResponse";
import BasicUserFriendRequest from "../components/BasicUserFriendRequest";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */

const AllFriendRequestsView = () => {
  const [pendingToMe, setPendingToMe] = useState<IPendingFriendResponse[]>([]);
  const [pendingFromMe, setPendingFromMe] = useState<IPendingFriendResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchFriendRequests = async () => {
      try {
        const [toMe, fromMe] = await Promise.all([
          socialMediaApiService.getUsersWithPendingFriendRequestsToMeAsync(),
          socialMediaApiService.getUsersWithPendingFriendRequestsFromMeAsync(),
        ]);
        if (!abortCont.signal.aborted) {
          setPendingToMe(toMe);
          setPendingFromMe(fromMe);
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

    fetchFriendRequests();

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
    return <p>Laddar vänförfrågningarna...</p>;
  }

  return (
    <div className="all-friend-requests">
      <h1>VÄNFÖRFRÅGNINGAR</h1>

      <section className="sub-section">
        <h2>{`Till mig (${pendingToMe.length})`}</h2>

        {pendingToMe.length === 0 ? (
          <p>Det finns inga aktuella vänförfrågningar till dig</p>
        ) : (
          <>
            <div className="separate-data">
              <p>Namn</p>
              <div className="separate-data-second-variable">
                <p>Skickat</p>
              </div>
            </div>
            {pendingToMe.map((user: IPendingFriendResponse) => (
              <BasicUserFriendRequest
                key={user.id}
                id={user.id}
                firstName={user.firstName}
                lastName={user.lastName}
                requestedAt={user.requestedAt}
              />
            ))}
          </>
        )}
      </section>

      <section className="sub-section">
        <h2>{`Som jag har skickat (${pendingFromMe.length})`}</h2>

        {pendingFromMe.length === 0 ? (
          <p>Det finns inga aktuella vänförfrågningar från dig</p>
        ) : (
          <>
            <div className="separate-data">
              <p>Namn</p>
              <div className="separate-data-second-variable">
                <p>Skickat</p>
              </div>
            </div>
            {pendingFromMe.map((user: IPendingFriendResponse) => (
              <BasicUserFriendRequest
                key={user.id}
                id={user.id}
                firstName={user.firstName}
                lastName={user.lastName}
                requestedAt={user.requestedAt}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default AllFriendRequestsView;
