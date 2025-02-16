import { useEffect, useState } from "react";
import { Sex } from "../enums/sex";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { IDetailedUserResponse } from "../models/IDetailedUserResponse";
import { IUpdatePersonalInfoRequest } from "../models/IUpdatePersonalInfoRequest";
import { initialDetailedUser } from "../initial-values/initial-values";
import InterestList from "../components/InterestList";

const MyProfileView = () => {
  const [myUser, setMyUser] = useState<IDetailedUserResponse>(initialDetailedUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>("");
  const [useEffectTrigger, setUseEffectTrigger] = useState<number>(1);

  useEffect(() => {
    const abortCont = new AbortController();

    const fetchMyUser = async () => {
      try {
        const response = await socialMediaApiService.getMyselfAsync(abortCont.signal);
        if (!abortCont.signal.aborted) {
          setMyUser(response);          
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

    fetchMyUser();

    return () => abortCont.abort();
  }, [useEffectTrigger]);    

  const handleEditMode = () => {
	setIsEditMode(true);
	setNewText(myUser.personalInfo ?? "");
  }

  const handleSavePersonalInfo = async (newText: string) => {
    const updatedPersonalInfo = newText.trim() === "" ? null : newText;
    const request: IUpdatePersonalInfoRequest = {
      personalInfo: updatedPersonalInfo,
    };
    try {
      await socialMediaApiService.updatePersonalInfoAsync(request);
	  setUseEffectTrigger((prev) => prev + 1);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsEditMode(false);
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar din profil...</p>;
  }

  return (
    <div className="my-profile-view">
      <h1>MIN PROFIL</h1>
      <div className="sub-section">
        <p>
          {myUser.firstName} {myUser.lastName}, ({myUser.sex === Sex.Male ? "Man" : "Kvinna"})
        </p>
      </div>

      <div className="sub-section">
        <h4>Email:</h4>
        <p>{myUser.email}</p>
      </div>
      <div className="sub-section">
        <h4>Födelsedatum:</h4>
        <p>
          {new Date(myUser.dateOfBirth).toLocaleDateString("sv-SE")}, ({myUser.age} år)
        </p>
      </div>
      <div className="sub-section">
        <h4>Mina intressen:</h4>
        {myUser.interests.length === 0 ? (
          <p>Inga intressen tillagda än.</p>
        ) : (
          <InterestList interests={myUser.interests} />
        )}
      </div>

      <div className="sub-section">
        <h4>Om mig:</h4>

        {!isEditMode && (
          <div>
            {myUser.personalInfo === null ? (
              <p>Inget skrivet än. Gör gärna det om du vill berätta mer om dig själv. Endast dina vänner kan se vad som står här.</p>
            ) : (
              <p>{myUser.personalInfo}</p>
            )}
            <button onClick={() => handleEditMode()}>Redigera</button>
          </div>
        )}
        {isEditMode && (
          <div>
            <textarea value={newText} rows={5} onChange={(e) => setNewText(e.target.value)} />
            <div>
              <button onClick={() => handleSavePersonalInfo(newText)}>Spara</button>
              <button onClick={() => setIsEditMode(false)}>Avbryt</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfileView;
