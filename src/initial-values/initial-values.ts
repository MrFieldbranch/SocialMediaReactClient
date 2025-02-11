import { Sex } from "../enums/sex";
import { TypeOfUser } from "../enums/type-of-user";
import { IDetailedUserResponse } from "../models/IDetailedUserResponse";

export const initialDetailedUser: IDetailedUserResponse = {
	id: 0,
	firstName: "",
	lastName: "",
	email: "",
	personalInfo: null,
	dateOfBirth: new Date(),
	age: 0,
	sex: Sex.Male,
	typeOfUser: TypeOfUser.Default,
	friends: [],
	interests: [],
	postsToPublicBoard: [],
	conversationsAsUser1: [],
	conversationsAsUser2: []	
}

