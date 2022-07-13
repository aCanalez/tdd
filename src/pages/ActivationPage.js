import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { activate } from "../api/apiCalls";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";

const ActivationPage = (props) => {
  const params = useParams();
  const [result, setResult] = useState();
  const token = props?.match?.params?.token || params.token;
  useEffect(() => {
    async function activateRequest() {
      setResult();
      try {
        await activate(token);
        setResult("success");
      } catch (error) {
        setResult("fail");
      }
    }
    activateRequest()
  }, [token]);
  let content = (
    <Alert type="secondary" center>
      <Spinner size={"big"} />
    </Alert>
  );
  if (result === "success") {
    content = <Alert text={"Account is activated"} />;
  } else if (result === "fail") {
    content = <Alert type={"danger"}>Activation failure</Alert>;
  }
  return <div data-testid="activation-page">{content}</div>;
};

export default ActivationPage;
