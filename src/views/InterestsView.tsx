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

  const handleError = () => {
    setNewInterest("");
    setError(null);
  };

  if (error)
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={handleError}>Tillbaka</button>
      </div>
    );

  if (isLoading) {
    return <p>Laddar intressen...</p>;
  }

  if (location.pathname === "/interests")
    return (
      <div className="interests">
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
        <h1>ALLA INTRESSEN</h1>
        <div className="vertical-spacing">
          {interests.length === 0 ? (
            <p className="mar-top-1">Inga intressen finns än. Lägg gärna till ett!</p>
          ) : (
            <div>
              <InterestList interests={interests} />
            </div>
          )}
        </div>

        {!isNewInterestMode && (
          <button className="edit-or-write-new-button" onClick={() => setIsNewInterestMode(true)}>
            Skapa ett intresse
          </button>
        )}
        {isNewInterestMode && (
          <div>
            <input type="text" required onChange={(e) => setNewInterest(e.target.value)} />
            <div className="confirm-or-cancel">
              <button className="confirm" onClick={() => handleCreateNewInterest(newInterest)}>
                Spara
              </button>
              <button className="cancel" onClick={() => setIsNewInterestMode(false)}>
                Avbryt
              </button>
            </div>
          </div>
        )}
      </div>
    );

  if (location.pathname === "/interests/myinterests")
    return (
      <div className="interests">
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
        <h1>MINA INTRESSEN</h1>
        <div className="vertical-spacing">
          {interests.length === 0 ? (
            <p className="mar-top-1">Du har inte lagt till några intressen än. Gör gärna det bland "Intressen som jag inte har".</p>
          ) : (
            <InterestList interests={interests} onButtonClick={handleRemoveInterest} buttonText="Ta bort" color="rgb(243, 193, 193)" />
          )}
        </div>
      </div>
    );

  if (location.pathname === "/interests/notmyinterests")
    return (
      <div className="interests">
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
        <h1>INTRESSEN SOM JAG INTE HAR</h1>
        <div className="vertical-spacing">
          {interests.length === 0 ? (
            <p className="mar-top-1">Det finns inga intressen i systemet som du inte redan har.</p>
          ) : (
            <InterestList interests={interests} onButtonClick={handleAddInterest} buttonText="Lägg till" color="rgb(215, 243, 215)" />
          )}
        </div>
      </div>
    );
};

export default InterestsView;
