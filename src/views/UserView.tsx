import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sex } from "../enums/sex";
import { TypeOfUser } from "../enums/type-of-user";
import { IBasicUserResponse } from "../models/IBasicUserResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import BasicUser from "../components/BasicUser";
import SubMenu from "../components/SubMenu";
import { IDetailedUserResponse } from "../models/IDetailedUserResponse";
import { initialDetailedUser } from "../initial-values/initial-values";
import InterestList from "../components/InterestList";

const UserView = () => {
  const { id } = useParams<{ id: string }>(); // Get the id from URL
  const otherUserId = Number(id);

  const navigate = useNavigate();

  const [otherUser, setOtherUser] = useState<IDetailedUserResponse>(initialDetailedUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchOtherUser = async () => {
      try {
        const response = await socialMediaApiService.getOtherUserAsync(otherUserId, abortCont.signal);
        if (!abortCont.signal.aborted) {
          const mappedTypeOfUser =
            {
              0: TypeOfUser.Default,
              1: TypeOfUser.Me,
              2: TypeOfUser.Friend,
              3: TypeOfUser.Stranger,
              4: TypeOfUser.UserThatSentFriendRequestToMe,
              5: TypeOfUser.UserThatISentFriendRequestTo,
            }[response.typeOfUser] || TypeOfUser.Default;

          setOtherUser({
            ...response,
            typeOfUser: mappedTypeOfUser,
            sex: response.sex === 0 ? Sex.Male : Sex.Female,
          });
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

    fetchOtherUser();

    return () => abortCont.abort();
  }, [id]);

  const renderCorrectSubMenu = (typeOfUser: TypeOfUser): React.ReactElement | null => {
    if (typeOfUser === TypeOfUser.Friend) {
      const firstName = otherUser.firstName;
      const lastName = otherUser.lastName;
      return (
        <SubMenu
          items={[
            {
              label: "Gå till privat konversation",
              linkTo: `/conversation/${id}`,
              optionalProps: { firstName, lastName },
            },
            {
              label: "Säg upp vänskapen",
              onClick: () => endFriendship(otherUserId),
            },
          ]}
        />
      );
    } else if (typeOfUser === TypeOfUser.Stranger) {
      return (
        <SubMenu
          items={[
            {
              label: "Skicka en vänförfrågan",
              onClick: () => sendFriendRequest(otherUserId),
            },
          ]}
        />
      );
    } else if (typeOfUser === TypeOfUser.UserThatSentFriendRequestToMe) {
      return (
        <SubMenu
          items={[
            {
              label: "Acceptera vänförfrågan",
              onClick: () => acceptFriendRequest(otherUserId),
            },
            {
              label: "Neka vänförfrågan",
              onClick: () => declineFriendRequest(otherUserId),
            },
          ]}
        />
      );
    } else if (typeOfUser === TypeOfUser.UserThatISentFriendRequestTo) {
      return (
        <SubMenu
          items={[
            {
              label: "Ta tillbaka vänförfrågan",
              onClick: () => withdrawFriendRequest(otherUserId),
            },
          ]}
        />
      );
    } else {
      return null;
    }
  };

  const endFriendship = async (otherUserId: number): Promise<void> => {
    try {
      await socialMediaApiService.endFriendshipAsync(otherUserId);
      navigate("/myfriends");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const sendFriendRequest = async (otherUserId: number): Promise<void> => {
    try {
      await socialMediaApiService.sendFriendRequestAsync(otherUserId);
      navigate("/friendrequests");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const acceptFriendRequest = async (otherUserId: number): Promise<void> => {
    try {
      await socialMediaApiService.acceptFriendRequestAsync(otherUserId);
      navigate("/myfriends");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const declineFriendRequest = async (otherUserId: number): Promise<void> => {
    try {
      await socialMediaApiService.declineFriendRequestAsync(otherUserId);
      navigate("/friendrequests");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const withdrawFriendRequest = async (otherUserId: number): Promise<void> => {
    try {
      await socialMediaApiService.withdrawFriendRequestAsync(otherUserId);
      navigate("/friendrequests");
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const getUserDescription = (typeOfUser: TypeOfUser): string => {
    if (typeOfUser === TypeOfUser.Friend) return "VÄN";
    else if (typeOfUser === TypeOfUser.Stranger) return "INTE VÄN";
    else if (typeOfUser === TypeOfUser.UserThatSentFriendRequestToMe) return "HAR SKICKAT VÄNFÖRFRÅGAN TILL DIG";
    else if (typeOfUser === TypeOfUser.UserThatISentFriendRequestTo) return "HAR FÅTT EN VÄNFÖRFRÅGAN FRÅN DIG";
    else return "OKÄND STATUS";
  };

  if (error) return <p className="error-message">{error}</p>;

  if (isLoading) {
    return <p>Laddar användarprofilen...</p>;
  }

  return (
    <div className="user-view">
      {renderCorrectSubMenu(otherUser.typeOfUser)}
      <h1>ANVÄNDARPROFIL</h1>
      <div className="sub-section">
        <p>
          {otherUser.firstName} {otherUser.lastName}, ({otherUser.sex === Sex.Male ? "Man" : "Kvinna"}),{" "}
          {getUserDescription(otherUser.typeOfUser)}
        </p>
      </div>
      <div className="sub-section">
        <p>Email:</p>
        <p>{otherUser.email}</p>
      </div>
      <div className="sub-section">
        <p>Födelsedatum:</p>
        <p>
          {new Date(otherUser.dateOfBirth).toLocaleDateString("sv-SE")}, ({otherUser.age}) år
        </p>
      </div>
      <div className="sub-section">
        <p>Intressen:</p>
        {otherUser.interests.length === 0 ? (
          <p>Inga intressen tillagda än.</p>
        ) : (
          <InterestList interests={otherUser.interests} />
        )}
      </div>
      <div className="sub-section">
        <p>Om personen:</p>
        {otherUser.typeOfUser !== TypeOfUser.Friend ? (
          <p>Du är inte vän med denna person så du kan inte se detta stycke.</p>
        ) : (
          <p>{otherUser.personalInfo}</p>
        )}
      </div>
      <div className="sub-section">
        <p>Personens vänner:</p>
        {otherUser.friends.length === 0 ? (
          <p>Inga vänner</p>
        ) : (
          otherUser.friends.map((friend: IBasicUserResponse) => (
            <BasicUser key={friend.id} id={friend.id} firstName={friend.firstName} lastName={friend.lastName} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserView;
