import { Link } from 'react-router-dom';
import './BasicUserSharedInterests.css';
import { IUserWithSharedInterestsResponse } from '../../models/IUserWithSharedInterestsResponse';

const BasicUserSharedInterests = ({ id, firstName, lastName, sharedInterestsCount }: IUserWithSharedInterestsResponse) => {
	return (
		<Link to={`/user/${id}`} className="basic-user-shared-interests">
			<div className="separate-data">
				<p>{`${firstName} ${lastName}`}</p>
				<p>{sharedInterestsCount}</p>
			</div>
		</Link>
	)
}

export default BasicUserSharedInterests;