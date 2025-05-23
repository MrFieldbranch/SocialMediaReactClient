import { IInterestResponse } from "../models/IInterestResponse"

export type InterestListProps = {
  interests: IInterestResponse[];
  onButtonClick?: (id: number) => void;
  buttonText?: string;
  color?: string;
  hoverColor?: string;
};