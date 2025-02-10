import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { useEffect, useState } from "react";
import SubMenu from "../components/SubMenu";
import BasicUserSharedInterests from "../components/BasicUserSharedInterests";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

const StrangersSortedView = () => {
  const [strangersSorted, setStrangersSorted] = useState<IUserWithSharedInterestsResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchStrangersSorted = async () => {
      try {
        const response = await socialMediaApiService.getStrangersBasedOnInterestsAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setStrangersSorted(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
        }
      }
    };

    fetchStrangersSorted();

    return () => abortCont.abort();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

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

export default StrangersSortedView;
