import './BasicUser.css';
import { IBasicUserResponse } from '../../models/IBasicUserResponse';
import { Link } from 'react-router-dom';


const BasicUser = ({ id, firstName, lastName }: IBasicUserResponse) => {
	const loggedInUserId = Number(localStorage.getItem("userId"));

	const profileLink = id === loggedInUserId ? "/myprofile" : `/user/${id}`

	return (
		<Link to={profileLink} className="basic-user">
			<p>{`${firstName} ${lastName}`}</p>
		</Link>
	);
};

export default BasicUser;