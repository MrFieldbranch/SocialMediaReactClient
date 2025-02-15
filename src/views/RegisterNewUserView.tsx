import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sex } from "../enums/sex";
import { INewUserRequest } from "../models/INewUserRequest";
import socialMediaApiService from "../services/social-media-api-service"; /* Singleton */
import { ILoginRequest } from "../models/ILoginRequest";
import { ILoginResponse } from "../models/ILoginResponse";
import { jwtDecode } from "jwt-decode";

const RegisterNewUserView = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const [newEmail, setNewEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");
  const [newDateOfBirth, setNewDateOfBirth] = useState<string>("1970-01-01");
  const [newSex, setNewSex] = useState<string>("Man");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleRegisterAndLogin = async (
    newEmail: string,
    newPassword: string,
    newFirstName: string,
    newLastName: string,
    newDateOfBirth: string,
    newSex: string
  ) => {
    if (newEmail.trim() === "" || newPassword.trim() === "" || newFirstName.trim() === "" || newLastName.trim() === "") {
      setError("You have to write something in each field.");
      return;
    }

    const dateOfBirth: Date = new Date(newDateOfBirth);
    const sex: Sex = newSex === "Man" ? Sex.Male : Sex.Female;

    const request: INewUserRequest = {
      email: newEmail,
      password: newPassword,
      firstName: newFirstName,
      lastName: newLastName,
      dateOfBirth: dateOfBirth,
      sex: sex,
    };

    try {
      await socialMediaApiService.registerNewUser(request);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
      return;
    }

    try {
      const loginRequest: ILoginRequest = {
        email: newEmail,
        password: newPassword,
      };
      const loginResponse: ILoginResponse = await socialMediaApiService.loginAsync(loginRequest);
      localStorage.setItem("authToken", loginResponse.token);
      socialMediaApiService.setAuthorizationHeader(loginResponse.token);
      const decodedToken: any = jwtDecode(loginResponse.token);
      localStorage.setItem("userId", decodedToken.nameid);
      setIsLoggedIn(true);
      navigate("/myprofile");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="register-new-user-view">
      <h1>NY ANVÄNDARE</h1>
      <div>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" value={newEmail} required onChange={(e) => setNewEmail(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Lösenord:</label>
        <input type="password" id="password" value={newPassword} required onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <div>
        <label htmlFor="firstname">Förnamn:</label>
        <input type="text" id="firstname" value={newFirstName} required onChange={(e) => setNewFirstName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="lastname">Efternamn:</label>
        <input type="text" id="lastname" value={newLastName} required onChange={(e) => setNewLastName(e.target.value)} />
      </div>
      <div>
        <label htmlFor="dateofbirth">Födelsedatum:</label>
        <input type="date" id="dateofbirth" value={newDateOfBirth} required onChange={(e) => setNewDateOfBirth(e.target.value)} />
      </div>
      <div>
        <label htmlFor="sex">Kön:</label>
        <select id="sex" value={newSex} onChange={(e) => setNewSex(e.target.value)}>
          <option value="Man">Man</option>
          <option value="Kvinna">Kvinna</option>
        </select>
      </div>
      <button onClick={() => handleRegisterAndLogin(newEmail, newPassword, newFirstName, newLastName, newDateOfBirth, newSex)}>
        Registrera dig
      </button>
    </div>
  );
};

export default RegisterNewUserView;
