import { IBasicUserResponse } from "../models/IBasicUserResponse";
import { IInterestResponse } from "../models/IInterestResponse";
import { ILoginRequest } from "../models/ILoginRequest";
import { ILoginResponse } from "../models/ILoginResponse";
import { INewUserRequest } from "../models/INewUserRequest";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

export class SocialMediaApiService {
    private httpClient: { [key: string]: string };

    constructor(private baseUrl: string) {
        this.httpClient = {
            "Content-Type": "application/json",
        };
    }

    setAuthorizationHeader(token: string): void {
        this.httpClient.Authorization = `Bearer ${token}`;      
    }

    removeAuthorizationHeader(): void {
        delete this.httpClient.Authorization;
    }

    async registerNewUser(newUser: INewUserRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/registration`, {
            method: "POST",
            headers: this.httpClient,
            body: JSON.stringify(newUser),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    }

    async loginAsync(loginRequest: ILoginRequest): Promise<ILoginResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: "POST",
            headers: this.httpClient,
            body: JSON.stringify(loginRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        const loginResponse: ILoginResponse | null = await response.json();

        if (!loginResponse) {
            throw new Error("Failed to deserialize user data.");
        }

        return loginResponse;
    }

    async getAllInterestsAsync(): Promise<IInterestResponse[]> {
        const response = await fetch(`${this.baseUrl}/interest`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch interests: ${errorMessage || "No error message provided by the server."}`);
        }

        const interests: IInterestResponse[] = await response.json();
        return interests || []    // Ensure it returns an empty array if the response is null or undefined
    }

    async getMyInterestsAsync(): Promise<IInterestResponse[]> {
        const response = await fetch(`${this.baseUrl}/interest/myowninterests`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch your interests: ${errorMessage || "No error message provided by the server."}`);
        }

        const myInterests: IInterestResponse[] = await response.json();
        return myInterests || [];    // Return an empty array if the response is null or undefined
    }

    async getInterestsNotOwnedByMeAsync(): Promise<IInterestResponse[]> {
        const response = await fetch(`${this.baseUrl}/interest/interestsnotownedbyme`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch the interests that you don't have: ${errorMessage || "No error message provided by the server."}`);
        }

        const interestsNotOwnedByMe: IInterestResponse[] = await response.json();
        return interestsNotOwnedByMe || [];    // Return an empty array if the response is null or undefined
    }

    async getMyFriendsAsync(): Promise<IBasicUserResponse[]> {
        const response = await fetch(`${this.baseUrl}/user/myfriends`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch your friends: ${errorMessage || "No error message provided by the server."}`);
        }

        const myFriends: IBasicUserResponse[] = await response.json();
        return myFriends || [];  // Return an empty array if the response is null or undefined
    }

    async getStrangersAsync(): Promise<IBasicUserResponse[]> {
        const response = await fetch(`${this.baseUrl}/user/strangers`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people that are not your friends: ${errorMessage || "No error message provided by the server."}`)
        }

        const strangers: IBasicUserResponse[] = await response.json();
        return strangers || [];    // Return an empty array if the response is null or undefined
    }

    async getStrangersBasedOnInterestsAsync(): Promise<IUserWithSharedInterestsResponse[]> {
        const response = await fetch(`${this.baseUrl}/user/getstrangersbasedoninterests`, {
            method: "GET",
            headers: this.httpClient,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people that are not your friends, based on common interests: ${errorMessage || "No error message provided by the server."}`)
        }

        const strangersBasedOnCommonInterests: IUserWithSharedInterestsResponse[] = await response.json();
        return strangersBasedOnCommonInterests || [];    // Return an empty array if the response is null or undefined
    }


}