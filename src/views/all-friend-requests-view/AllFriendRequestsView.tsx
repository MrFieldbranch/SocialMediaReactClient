import { useEffect, useState } from "react";
import "./AllFriendRequestsView.css";
import { IPendingFriendResponse } from "../../models/IPendingFriendResponse";
import BasicUserFriendRequest from "../../components/basic-user-friend-request/BasicUserFriendRequest";
import socialMediaApiService from "../../services/social-media-api-service"; /* Singleton */

const AllFriendRequestsView = () => {
  const [pendingToMe, setPendingToMe] = useState<IPendingFriendResponse[]>([]);
  const [pendingFromMe, setPendingFromMe] = useState<IPendingFriendResponse[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [toMe, fromMe] = await Promise.all([
          socialMediaApiService.getUsersWithPendingFriendRequestsToMeAsync(),
          socialMediaApiService.getUsersWithPendingFriendRequestsFromMeAsync(),
        ]);

        if (isMounted) {
          setPendingToMe(toMe);
          setPendingFromMe(fromMe);
        }
      } catch (error: any) {
        if (isMounted) {
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <h1>VÄNFÖRFRÅGNINGAR</h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <section className="friend-requests-section">
        <h2>{`Till mig (${pendingToMe.length})`}</h2>
        <div className="separate-data">
          <p>Namn</p>
          <p>Skickat</p>
        </div>
        {pendingToMe.length === 0 ? (
          <p>Det finns inga aktuella vänförfrågningar till dig</p>
        ) : (
          pendingToMe.map((user) => (
            <BasicUserFriendRequest
              key={user.id}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              requestedAt={user.requestedAt}
            />
          ))
        )}
      </section>
      <section className="friend-requests-section">
        <h2>{`Som jag har skickat (${pendingFromMe.length})`}</h2>
        <div className="separate-data">
          <p>Namn</p>
          <p>Skickat</p>
        </div>
        {pendingFromMe.length === 0 ? (
          <p>Det finns inga aktuella vänförfrågningar från dig</p>
        ) : (
          pendingFromMe.map((user) => (
            <BasicUserFriendRequest
              key={user.id}
              id={user.id}
              firstName={user.firstName}
              lastName={user.lastName}
              requestedAt={user.requestedAt}
            />
          ))
        )}
      </section>
    </>
  );
};

export default AllFriendRequestsView;
