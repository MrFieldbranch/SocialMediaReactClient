import { useEffect, useState } from "react";
import { IBasicUserResponse } from "../models/IBasicUserResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import BasicUser from "../components/BasicUser";
import SubMenu from "../components/SubMenu";

const StrangersView = () => {
  const [strangers, setStrangers] = useState<IBasicUserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchStrangers = async () => {
      try {
        const response = await socialMediaApiService.getStrangersAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setStrangers(response);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unknown error occurred.");
        }
      }
    };

    fetchStrangers();

    return () => abortCont.abort();
  }, []);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  

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
        <p>Det finns inga användare i communityn som inte redan är i din vänlista, 
			eller som inte redan ingår i en vänförfrågan.</p>
      ) : (
        strangers.map((stranger: IBasicUserResponse) => (
          <BasicUser key={stranger.id} id={stranger.id} firstName={stranger.firstName} lastName={stranger.lastName} />
        ))
      )}

    </div>
  );
};

export default StrangersView;
