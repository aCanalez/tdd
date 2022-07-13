import React from "react";

const Alert = (props) => {
  let classForAlert = `alert alert-${props.type}`;
  if (props.center) {
    classForAlert += " text-center";
  }
  return (
    <div className={classForAlert}>
      {props.text}
      {props.children}
    </div>
  );
};

Alert.defaultProps = {
  type: "success",
};

export default Alert;
