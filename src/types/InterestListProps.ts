import { IInterestResponse } from "../models/IInterestResponse"

export type InterestListProps = {
	interests: IInterestResponse[];
	onButtonClick?: (id: number) => void;
	addOrRemove?: string;
	color?: string; 
}