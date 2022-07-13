import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../api/apiCalls";
import Alert from "../components/Alert";
import ProfileCard from "../components/ProfileCard";
import Spinner from "../components/Spinner";

const UserPage = ({ match, auth }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [failResponse, setFailedResponse] = useState(undefined);
  const params = useParams();
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const response = await getUserById(params.id || match.params.id);
      setUser(response.data);
      setLoading(false);
    }
    fetchUsers().catch((e) => {
      setLoading(false);
      setFailedResponse(e.response.data.message);
    });
  }, [params.id]);

  let content = (
    <Alert type="secondary" center>
      <Spinner size="big" />
    </Alert>
  );

  if (!loading) {
    if (failResponse) {
      content = (
        <Alert type="danger" center>
          {failResponse}
        </Alert>
      );
    } else {
      content = <ProfileCard user={user} auth={auth} />;
    }
  }

  return <div data-testid="user-page">{content}</div>;
};

export default UserPage;
