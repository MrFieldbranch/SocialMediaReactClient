import { Sex } from "../enums/sex";
import { TypeOfUser } from "../enums/type-of-user";
import { IBasicUserResponse } from "./IBasicUserResponse";
import { IConversationResponse } from "./IConversationResponse";
import { IInterestResponse } from "./IInterestResponse";
import { IPostToPublicBoardResponse } from "./IPostToPublicBoardResponse";

export interface IDetailedUserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    personalInfo: string | null;
    dateOfBirth: Date;
    age: number;
    sex: Sex;
    typeOfUser: TypeOfUser;
    friends: IBasicUserResponse[];
    interests: IInterestResponse[];
    postsToPublicBoard: IPostToPublicBoardResponse[];
    conversationsAsUser1: IConversationResponse[];
    conversationsAsUser2: IConversationResponse[];
}