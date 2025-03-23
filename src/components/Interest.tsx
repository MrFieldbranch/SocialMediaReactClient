import { InterestProps } from "../types/InterestProps";

const Interest = ({ id, name, onButtonClick, color, hoverColor, buttonText }: InterestProps) => {
  return (
    <div className="item">
      <p>{name}</p>
      {onButtonClick && (
        <button
          onClick={() => onButtonClick(id)}
          style={{ "--bg-color-interest": color, "--hover-bg-color-interest": hoverColor } as React.CSSProperties}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Interest;
