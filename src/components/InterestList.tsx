import { InterestListProps } from "../types/InterestListProps";
import Interest from "./Interest";

const InterestList = ({ interests, onButtonClick, buttonText, color }: InterestListProps) => {
  return (
    <div className="wrap-container">
      {interests.map((interest) => (
        <Interest
          key={interest.id}
          id={interest.id}
          name={interest.name}
          onButtonClick={onButtonClick}
          color={color}
          buttonText={buttonText}
        />
      ))}
    </div>
  );
};

export default InterestList;


/* const InterestList = ({ interests, onButtonClick, addOrRemove, color }: InterestListProps) => {
  return (
    <div className="interest-list">
      {interests.map((interest) => (
        <li key={interest.id}>
          {interest.name}
          {onButtonClick && (
            <button
              onClick={() => onButtonClick(interest.id)}
              className="button-hover"
              style={{ "--hover-bg-color": color } as React.CSSProperties}
            >
              {addOrRemove}
            </button>
          )}
        </li>
      ))}
    </div>
  );
}; */
