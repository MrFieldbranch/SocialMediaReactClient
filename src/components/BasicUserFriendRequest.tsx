import { IPendingFriendResponse } from "../models/IPendingFriendResponse";
import { Link } from "react-router-dom";

const BasicUserFriendRequest = ({ id, firstName, lastName, requestedAt }: IPendingFriendResponse) => {
	
  const requestDate = new Date(requestedAt);

  return (
    <Link to={`/user/${id}`}>
      <div className="separate-data basic-user">
        <p>{`${firstName} ${lastName}`}</p>
        <div className="separate-data-second-variable">
          <p>
            {`${requestDate.toLocaleDateString("sv-SE")}, klockan ${requestDate.toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BasicUserFriendRequest;
