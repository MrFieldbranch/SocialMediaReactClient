import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { useEffect, useState } from "react";
import SubMenu from "../components/SubMenu";
import BasicUserSharedInterests from "../components/BasicUserSharedInterests";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

const StrangersSortedView = () => {
  const [strangersSorted, setStrangersSorted] = useState<IUserWithSharedInterestsResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    let isMounted = false;

    const fetchStrangersSorted = async () => {
      try {
        const strangersSortedFromApi =
          await socialMediaApiService.getStrangersBasedOnInterestsAsync();
        if (isMounted) {
          setStrangersSorted(strangersSortedFromApi);
        }
      } catch (error: any) {
        if (isMounted) {
          setErrorMessage(error.message || "An unknown error occurred.");
        }
      }
    };

    fetchStrangersSorted();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="strangers-sorted-view">
      <h1>
        MÖJLIGA VÄNNER (sorterade efter antal gemensamma intressen med dig)
      </h1>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <SubMenu
        items={[
          { label: "Gå tillbaka till osorterad vy", linkTo: "/strangers" },
        ]}
      />
      <div className="separate-data">
        <p>Namn</p>
        <p>Antal gemensamma intressen</p>
      </div>
      {strangersSorted.length === 0 ? (
        <p>
          Det finns inga andra användare som har något intresse gemensamt med
          dig
        </p>
      ) : (
        strangersSorted.map((stranger) => (
          <BasicUserSharedInterests
            key={stranger.id}
            id={stranger.id}
            firstName={stranger.firstName}
            lastName={stranger.lastName}
            sharedInterestsCount={stranger.sharedInterestsCount}
          />
        ))
      )}
    </div>
  );
};

export default StrangersSortedView;
