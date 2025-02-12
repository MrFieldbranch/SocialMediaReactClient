import { InterestListProps } from "../types/InterestListProps";

const InterestList = ({ interests, onButtonClick, addOrRemove, color }: InterestListProps) => {
  return (
    <div className="interest-list">
      <ul>
        {interests.map((interest) => (
          <li key={interest.id}>
			{interest.name}
			{onButtonClick && (
				<button 
					onClick={() => onButtonClick(interest.id)} 
					className="button-hover" 
					style={{ "--hover-color": color } as React.CSSProperties}
				>
					{addOrRemove}
				</button>
			)}
		  </li>
        ))}
      </ul>
    </div>
  );
};

export default InterestList;
