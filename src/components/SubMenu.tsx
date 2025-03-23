import { Link } from "react-router-dom";
import { ISubMenuProps } from "../types/ISubMenuProps";

const SubMenu = ({ items }: ISubMenuProps) => {
  return (
    <section className="sub-menu">
      {items.map((item, index) => (
        <div key={index}>
          {item.linkTo ? (
            <Link to={item.linkTo} state={item.optionalProps}>
              {item.label}
            </Link>
          ) : (
            <button
              onClick={item.onClick}
              style={{ "--bg-color-sub-menu": item.color, "--hover-bg-color-sub-menu": item.hoverColor } as React.CSSProperties}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </section>
  );
};

export default SubMenu;
