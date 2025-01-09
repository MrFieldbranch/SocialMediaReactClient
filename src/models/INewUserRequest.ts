import { Sex } from "../enums/sex";

export interface INewUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: Date;
    sex: Sex;
}