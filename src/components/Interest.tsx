import { InterestProps } from "../types/InterestProps";

const Interest = ({ id, name, onButtonClick, color, buttonText }: InterestProps) => {
  return (
    <div className="item">
      <p>{name}</p>
      {onButtonClick && (
        <button 
			onClick={() => onButtonClick(id)} 			
			style={{ "--hover-bg-color": color } as React.CSSProperties}>
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Interest;
