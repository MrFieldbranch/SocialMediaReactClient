import { IBasicUserResponse } from "./IBasicUserResponse";

export interface IPostToPublicBoardResponse {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    user: IBasicUserResponse;
}