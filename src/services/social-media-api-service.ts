import { IBasicUserResponse } from "../models/IBasicUserResponse";
import { IConversationResponse } from "../models/IConversationResponse";
import { IDetailedUserResponse } from "../models/IDetailedUserResponse";
import { IInterestRequest } from "../models/IInterestRequest";
import { IInterestResponse } from "../models/IInterestResponse";
import { ILoginRequest } from "../models/ILoginRequest";
import { ILoginResponse } from "../models/ILoginResponse";
import { IMessageRequest } from "../models/IMessageRequest";
import { INewUserRequest } from "../models/INewUserRequest";
import { IPendingFriendResponse } from "../models/IPendingFriendResponse";
import { IPostToPublicBoardRequest } from "../models/IPostToPublicBoardRequest";
import { IPostToPublicBoardResponse } from "../models/IPostToPublicBoardResponse";
import { IUpdatePersonalInfoRequest } from "../models/IUpdatePersonalInfoRequest";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

export class SocialMediaApiService {
    private requestHeaders: { [key: string]: string };

    constructor(private baseUrl: string) {
        this.requestHeaders = {
            "Content-Type": "application/json",
        };
    }    

    setAuthorizationHeader(token: string): void {
        this.requestHeaders = {
            ...this.requestHeaders, 
            Authorization: `Bearer ${token}`, 
        };
        console.log(this.requestHeaders);
    }

    /* removeAuthorizationHeader(): void {
        delete this.httpClient.Authorization;
    } */

    removeAuthorizationHeader(): void {
        console.clear();
        const { Authorization, ...rest } = this.requestHeaders; // Destructure to exclude Authorization
        this.requestHeaders = rest; // Reassign to exclude the Authorization header
        console.log(this.requestHeaders); // Optional: Log the updated httpClient for debugging
    }

    async registerNewUser(newUserRequest: INewUserRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/registration`, {
            method: "POST",
            headers: this.requestHeaders,
            body: JSON.stringify(newUserRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to register new user: ${errorMessage || "No error message provided by the server."}`);
        }        
    }

    async loginAsync(loginRequest: ILoginRequest): Promise<ILoginResponse> {
        const response = await fetch(`${this.baseUrl}/login`, {
            method: "POST",
            headers: this.requestHeaders,
            body: JSON.stringify(loginRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();            
            throw new Error(`Failed to login: ${errorMessage || "No error message provided by the server."}`);
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
            headers: this.requestHeaders,
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
            headers: this.requestHeaders,
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
            headers: this.requestHeaders,
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
            headers: this.requestHeaders,
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
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people that are not your friends: ${errorMessage || "No error message provided by the server."}`);
        }

        const strangers: IBasicUserResponse[] = await response.json();
        return strangers || [];    // Return an empty array if the response is null or undefined
    }

    async getStrangersBasedOnInterestsAsync(): Promise<IUserWithSharedInterestsResponse[]> {
        const response = await fetch(`${this.baseUrl}/user/getstrangersbasedoninterests`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people that are not your friends, based on common interests: ${errorMessage || "No error message provided by the server."}`);
        }

        const strangersBasedOnCommonInterests: IUserWithSharedInterestsResponse[] = await response.json();
        return strangersBasedOnCommonInterests || [];    // Return an empty array if the response is null or undefined
    }

    async getUsersWithPendingFriendRequestsToMeAsync(): Promise<IPendingFriendResponse[]> {
        const response = await fetch(`${this.baseUrl}/friendrequest/allpendingtome`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people who have pending friend requests to you: ${errorMessage || "No error message provided by the server."}`);
        }

        const pendingFriendRequestsToMe: IPendingFriendResponse[] = await response.json();
        return pendingFriendRequestsToMe || [];    // Return an empty array if the response is null or undefined
    }

    async getUsersWithPendingFriendRequestsFromMeAsync(): Promise<IPendingFriendResponse[]> {
        const response = await fetch(`${this.baseUrl}/friendrequest/allpendingfromme`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch people who have pending friend requests from you: ${errorMessage || "No error message provided by the server."}`);
        }

        const pendingFriendRequestsFromMe: IPendingFriendResponse[] = await response.json();
        return pendingFriendRequestsFromMe || []    // Return an empty array if the response is null or undefined
    }

    async createNewInterestAsync(interestRequest: IInterestRequest): Promise<IInterestResponse> {
        const response = await fetch(`${this.baseUrl}/interest`, {
            method: "POST",
            headers: this.requestHeaders,
            body: JSON.stringify(interestRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to create interest: ${errorMessage || "No error message provided by the server."}`);
        }

        const newApprovedInterest = (await response.json()) as IInterestResponse | null;

        if (!newApprovedInterest) {
            throw new Error("Failed to deserialize user data.");
        }

        return newApprovedInterest;
    }

    async createNewPostToPublicBoardAsync(postRequest: IPostToPublicBoardRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/posttopublicboard`, {
            method: "POST",
            headers: this.requestHeaders,
            body: JSON.stringify(postRequest),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to create new post: ${errorMessage || "No error message provided by the server."}`);
        } 
    }

    async addInterestToMyselfAsync(interestId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/interest/${interestId}`, {
            method: "POST",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to add this interest to yourself: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async removeInterestFromMyselfAsync(interestId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/interest/${interestId}`, {
            method: "DELETE",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to remove this interest from yourself: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async sendFriendRequestAsync(otherUserId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/friendrequest/${otherUserId}`, {
            method: "POST",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to send friend request: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async acceptFriendRequestAsync(otherUserId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/friendrequest/acceptrequest/${otherUserId}`, {
            method: "PUT",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to accept friend request: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async declineFriendRequestAsync(otherUserId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/friendrequest/declinerequest/${otherUserId}`, {
            method: "DELETE",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to decline friend request: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async withdrawFriendRequestAsync(otherUserId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/friendrequest/withdrawrequest/${otherUserId}`, {
            method: "DELETE",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to withdraw friend request: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async endFriendshipAsync(otherUserId: number): Promise<void> {
        const response = await fetch(`${this.baseUrl}/friendrequest/cancelfriendship/${otherUserId}`, {
            method: "DELETE",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete friendship: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async getConversationAsync(otherUserId: number): Promise<IConversationResponse> {
        const response = await fetch(`${this.baseUrl}/conversation/${otherUserId}`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch conversation: ${errorMessage || "No error message provided by the server."}`);
        }

        const conversation: IConversationResponse | null = await response.json();

        if (!conversation) {
            throw new Error("Failed to deserialize conversation data.");
        }

        return conversation;
    }

    async sendMessageAsync(otherUserId: number, message: IMessageRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/message/${otherUserId}`, {
            method: "POST",
            headers: this.requestHeaders,
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to send message: ${errorMessage || "No error message provided by the server."}`);
        }
    }

    async getAllPostsAsync(): Promise<IPostToPublicBoardResponse[]> {
        const response = await fetch(`${this.baseUrl}/posttopublicboard`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch posts: ${errorMessage || "No error message provided by the server."}`);
        }

        const allPosts: IPostToPublicBoardResponse[] = await response.json();
        return allPosts || []    // Return an empty array if the response is null or undefined        
    }

    async getMyselfAsync(): Promise<IDetailedUserResponse> {
        console.log(this.requestHeaders);
        const response = await fetch(`${this.baseUrl}/user/getmyowndata`, {
            method: "GET",
            /* headers: new Headers(this.httpClient), */
            headers: {...this.requestHeaders},
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch your own user profile: ${errorMessage || "No error message provided by the server."}`);
        }

        const myself: IDetailedUserResponse | null = await response.json();

        if (!myself) {
            throw new Error("Failed to deserialize user data.");
        }

        return myself;
    }

    async getOtherUserAsync(otherUserId: number): Promise<IDetailedUserResponse> {
        const response = await fetch(`${this.baseUrl}/user/${otherUserId}`, {
            method: "GET",
            headers: this.requestHeaders,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to fetch the other user's profile: ${errorMessage || "No error message provided by the server."}`);
        }

        const user: IDetailedUserResponse | null = await response.json();

        if (!user) {
            throw new Error("Failed to deserialize user data.");
        }

        return user;
    }

    async updatePersonalInfoAsync(request: IUpdatePersonalInfoRequest): Promise<void> {
        const response = await fetch(`${this.baseUrl}/personalinfo`, {
            method: "PUT",
            headers: this.requestHeaders,
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to update your personal info: ${errorMessage || "No error message provided by the server."}`);
        }
    }
}

const socialMediaApiService = new SocialMediaApiService("https://localhost:8000");   /* Singleton */
export default socialMediaApiService;