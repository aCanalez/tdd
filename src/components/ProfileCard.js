import React from "react";
import { useSelector } from "react-redux";

const ProfileCard = (props) => {
  const auth = useSelector((store) => store.auth)
  const { user } = props;
  return (
    <div className="card text-center">
      <div className="card-header">
        <img
          src="/profile-pic.png"
          width="200"
          height="200"
          className="rounded-circle shadow"
          alt="profile-pic"
        />
      </div>
      <div className="card-body">
        <h3>{user.username}</h3>
      </div>
      {auth && user.id === auth.id && <button>Edit</button>}
    </div>
  );
};

export default ProfileCard;
