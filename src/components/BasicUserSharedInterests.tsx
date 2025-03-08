import { Link } from "react-router-dom";
import { IUserWithSharedInterestsResponse } from "../models/IUserWithSharedInterestsResponse";

const BasicUserSharedInterests = ({ id, firstName, lastName, sharedInterestsCount }: IUserWithSharedInterestsResponse) => {
  return (
    <Link to={`/user/${id}`}>
      <div className="separate-data basic-user">
        <p>{`${firstName} ${lastName}`}</p>
        <div className="separate-data-second-variable">
          <p>{sharedInterestsCount}</p>
        </div>
      </div>
    </Link>
  );
};

export default BasicUserSharedInterests;
