import React from "react";
import Spinner from "./Spinner";

const ButtonWithProgress = (props) => {
  const { disabled, loading, onClick } = props;
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      onClick={onClick}
      className="btn btn-primary"
    >
      {loading && <Spinner />} {props.children}
    </button>
  );
};
export default ButtonWithProgress;
