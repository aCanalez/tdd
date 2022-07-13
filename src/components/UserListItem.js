import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const UserListItem = (props) => {
  const [image, setImage] = useState("/profile-pic.png");
  const { user } = props;

  useEffect(() => {
    if (props.user.image) {
      setImage(props.user.image);
    } else {
      setImage("/profile-pic.png");
    }
  }, [props.user.image]);

  return (
    <li className="list-group-item list-group-item-action">
      <Link to={`/user/${user.id}`}>
        <img
          src={image}
          alt="profile"
          width={30}
          className="rounded-circle shadow-sm m-2"
        />
        {user.username}
      </Link>
    </li>
  );
};

export default UserListItem;
