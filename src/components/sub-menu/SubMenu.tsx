import { Link } from "react-router-dom";
import { ISubMenuProps } from "../../types/ISubMenuProps";

const SubMenu = ({ items }: ISubMenuProps) => {
        return (
                <section>
                        {items.map((item, index) => (
                                <button key={index} onClick={item.onClick}>
                                        {item.linkTo ? (
                                                <Link to={item.linkTo}>
                                                        {item.label}
                                                </Link>
                                        ) : (item.label)
                                        }
                                </button>
                        ))}
                </section>
        );
};

export default SubMenu;