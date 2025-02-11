import { useEffect, useState } from "react";
import { Sex } from "../enums/sex";
import { IInterestResponse } from "../models/IInterestResponse";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { IDetailedUserResponse } from "../models/IDetailedUserResponse";
import { IUpdatePersonalInfoRequest } from "../models/IUpdatePersonalInfoRequest";
import { initialDetailedUser } from "../initial-values/initial-values";



const MyProfileView = () => {
  const [myUser, setMyUser] = useState<IDetailedUserResponse>(initialDetailedUser);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newText, setNewText] = useState<string>("");

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
  }, [isEditMode]);

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (isLoading) {
    return <p>Laddar din profil...</p>;
  }

  const handleSavePersonalInfo = async (newText: string) => {
    const updatedPersonalInfo = newText.trim() === "" ? null : newText;
    const request: IUpdatePersonalInfoRequest = {
      personalInfo: updatedPersonalInfo,
    };
    try {
      await socialMediaApiService.updatePersonalInfoAsync(request);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsEditMode(false);
    }
  };

  return (
    <div className="my-profile-view">
      <h1>MIN PROFIL</h1>
      <p>
        {myUser.firstName} {myUser.lastName}, ({myUser.sex === Sex.Male ? "Man" : "Kvinna"})
      </p>
      <p>Email:</p>
      <p>{myUser.email}</p>
      <p>Födelsedatum:</p>
      <p>
        {new Date(myUser.dateOfBirth).toLocaleDateString("sv-SE")}, ({myUser.age}) år
      </p>
      <p>Mina intressen:</p>
      {myUser.interests.length === 0 ? (
        <p>Inga intressen tillagda än.</p>
      ) : (
        <p>
          {myUser.interests.map((interest: IInterestResponse) => (
            <span key={interest.id}>{interest.name}</span>
          ))}
        </p>
      )}
      <p>Om mig:</p>

      {!isEditMode && (
        <div>
          {myUser.personalInfo === null ? (
            <p>Inget skrivet än. Gör gärna det om du vill berätta mer om dig själv. Endast dina vänner kan se vad som står här.</p>
          ) : (
            <p>{myUser.personalInfo}</p>
          )}
          <button onClick={() => setIsEditMode(true)}>Redigera</button>
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
  );
};

export default MyProfileView;
