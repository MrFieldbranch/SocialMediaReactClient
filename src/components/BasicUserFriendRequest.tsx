import { IPendingFriendResponse } from "../models/IPendingFriendResponse";
import { Link } from "react-router-dom";

const BasicUserFriendRequest = ({ id, firstName, lastName, requestedAt }: IPendingFriendResponse) => {
	
  const requestDate = new Date(requestedAt);

  return (
    <Link to={`/user/${id}`} className="basic-user-friend-request">
      <div className="separate-data">
        <p>{`${firstName} ${lastName}`}</p>
        <p>
          {`${requestDate.toLocaleDateString(
            "sv-SE"
          )}, klockan ${requestDate.toLocaleTimeString("sv-SE", {
            hour: "2-digit",
            minute: "2-digit",
          })}`}
        </p>
      </div>
    </Link>
  );
};

export default BasicUserFriendRequest;
