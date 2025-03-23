import { InterestListProps } from "../types/InterestListProps";
import Interest from "./Interest";

const InterestList = ({ interests, onButtonClick, buttonText, color, hoverColor }: InterestListProps) => {
  return (
    <div className="item-container">
      {interests.map((interest) => (
        <Interest
          key={interest.id}
          id={interest.id}
          name={interest.name}
          onButtonClick={onButtonClick}
          color={color}
		  hoverColor={hoverColor}
          buttonText={buttonText}
        />
      ))}
    </div>
  );
};

export default InterestList;