import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IInterestResponse } from "../models/IInterestResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import InterestList from "../components/InterestList";
import { IInterestRequest } from "../models/IInterestRequest";
import SubMenu from "../components/SubMenu";

const InterestsView = () => {
  const location = useLocation(); // This gives me access to the current pathname

  const [interests, setInterests] = useState<IInterestResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);
  const [isNewInterestMode, setIsNewInterestMode] = useState<boolean>(false);
  const [newInterest, setNewInterest] = useState<string>("");

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchInterests = async () => {
      try {
        let response: IInterestResponse[] = [];
        if (location.pathname === "/interests") response = await socialMediaApiService.getAllInterestsAsync(abortCont.signal);
        else if (location.pathname === "/interests/myinterests")
          response = await socialMediaApiService.getMyInterestsAsync(abortCont.signal);
        else response = await socialMediaApiService.getInterestsNotOwnedByMeAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setInterests(response);
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

    fetchInterests();

    return () => abortCont.abort();
  }, [location.pathname, useEffectTrigger]);

  const handleRemoveInterest = async (id: number) => {
    try {
      await socialMediaApiService.removeInterestFromMyselfAsync(id);
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const handleAddInterest = async (id: number) => {
    try {
      await socialMediaApiService.addInterestToMyselfAsync(id);
      setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    }
  };

  const handleCreateNewInterest = async (newInterest: string) => {
    if (newInterest.trim() === "") {
      setError("You have to write something.");
      setIsNewInterestMode(false);
    } else {
      const request: IInterestRequest = {
        name: newInterest,
      };

      try {
        await socialMediaApiService.createNewInterestAsync(request);
        setUseEffectTrigger((prev) => prev + 1);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      } finally {
        setNewInterest("");
        setIsNewInterestMode(false);
      }
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar intressen...</p>;
  }

  if (location.pathname === "/interests")
    return (
      <div className="interests-view">
        <SubMenu
          items={[
            {
              label: "Mina intressen",
              linkTo: "/interests/myinterests",
            },
            {
              label: "Välj bland intressen som jag inte har",
              linkTo: "/interests/notmyinterests",
            },
          ]}
        />
        <h1>Alla intressen som communityn har lagt upp</h1>
        {interests.length === 0 ? (
          <p>Inga intressen finns än. Lägg gärna till ett!</p>
        ) : (
          <div>
            <InterestList interests={interests} />
          </div>
        )}
        {!isNewInterestMode && <button onClick={() => setIsNewInterestMode(true)}>Skapa ett intresse</button>}
        {isNewInterestMode && (
          <div>
            <input type="text" required onChange={(e) => setNewInterest(e.target.value)} />
            <button onClick={() => handleCreateNewInterest(newInterest)}>Spara</button>
            <button onClick={() => setIsNewInterestMode(false)}>Avbryt</button>
          </div>
        )}
      </div>
    );

  if (location.pathname === "/interests/myinterests")
    return (
      <div className="interests-view">
        <SubMenu
          items={[
            {
              label: "Alla intressen",
              linkTo: "/interests",
            },
            {
              label: "Välj bland intressen som jag inte har",
              linkTo: "/interests/notmyinterests",
            },
          ]}
        />
        <h1>Mina intressen</h1>
        {interests.length === 0 ? (
          <p>Du har inte lagt till några intressen än. Gör gärna det bland "Intressen som jag inte har".</p>
        ) : (
          <InterestList interests={interests} onButtonClick={handleRemoveInterest} buttonText="Ta bort" color="red" />
        )}
      </div>
    );

  if (location.pathname === "/interests/notmyinterests")
    return (
      <div className="interests-view">
        <SubMenu
          items={[
            {
              label: "Alla intressen",
              linkTo: "/interests",
            },
            {
              label: "Mina intressen",
              linkTo: "/interests/myinterests",
            },
          ]}
        />
        <h1>Intressen som jag inte har</h1>
        {interests.length === 0 ? (
          <p>Det finns inga intressen i systemet som du inte redan har.</p>
        ) : (
          <InterestList interests={interests} onButtonClick={handleAddInterest} buttonText="Lägg till" color="lightgreen" />
        )}
      </div>
    );
};

export default InterestsView;
