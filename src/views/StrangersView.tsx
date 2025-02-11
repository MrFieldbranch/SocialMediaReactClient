import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IBasicUserResponse } from "../models/IBasicUserResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import BasicUser from "../components/BasicUser";
import BasicUserSharedInterests from "../components/BasicUserSharedInterests";
import SubMenu from "../components/SubMenu";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

const StrangersView = () => {
  const location = useLocation(); // This gives me access to the current pathname

  const [strangers, setStrangers] = useState<IBasicUserResponse[]>([]);
  const [strangersSorted, setStrangersSorted] = useState<IUserWithSharedInterestsResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchStrangers = async () => {
      try {
        if (location.pathname === "/strangers") {
          const response = await socialMediaApiService.getStrangersAsync(abortCont.signal);
          if (!abortCont.signal.aborted) {
            setStrangers(response);
            setError(null);
          }
        } else {
          const response = await socialMediaApiService.getStrangersBasedOnInterestsAsync(abortCont.signal);
          if (!abortCont.signal.aborted) {
            setStrangersSorted(response);
            setError(null);
          }
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrangers();

    return () => abortCont.abort();
  }, [location.pathname]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar möjliga vänner...</p>;
  }

  if (location.pathname === "/strangers")
    return (
      <div className="strangers-view">
        <SubMenu
          items={[
            {
              label: "Visa en lista där era gemensamma intressen beaktas",
              linkTo: "/strangers/sorted",
            },
          ]}
        />
        <h1>MÖJLIGA VÄNNER</h1>

        {strangers.length === 0 ? (
          <p>Det finns inga användare i communityn som inte redan är i din vänlista, eller som inte redan ingår i en vänförfrågan.</p>
        ) : (
          strangers.map((stranger: IBasicUserResponse) => (
            <BasicUser key={stranger.id} id={stranger.id} firstName={stranger.firstName} lastName={stranger.lastName} />
          ))
        )}
      </div>
    );

  if (location.pathname === "/strangers/sorted")
    return (
      <div className="strangers-sorted-view">
        <SubMenu items={[{ label: "Gå tillbaka till osorterad vy", linkTo: "/strangers" }]} />
        <h1>MÖJLIGA VÄNNER (sorterade efter antal gemensamma intressen med dig)</h1>
        {strangersSorted.length === 0 ? (
          <p>Det finns inga andra användare som har något intresse gemensamt med dig</p>
        ) : (
          <>
            <div className="separate-data">
              <p>Namn</p>
              <p>Antal gemensamma intressen</p>
            </div>
            {strangersSorted.map((stranger: IUserWithSharedInterestsResponse) => (
              <BasicUserSharedInterests
                key={stranger.id}
                id={stranger.id}
                firstName={stranger.firstName}
                lastName={stranger.lastName}
                sharedInterestsCount={stranger.sharedInterestsCount}
              />
            ))}
          </>
        )}
      </div>
    );
};

export default StrangersView;
