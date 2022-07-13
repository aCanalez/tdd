import React, { useState } from "react";
import axios from "axios";
import Input from "../components/Input";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";

const SignUpPage = () => {
  const [password, setPassword] = useState({
    password: "",
    passwordRepeat: "",
  });

  const [data, setData] = useState({
    username: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  const onChangePassword = (e) => {
    const currentValue = e.target.value;
    const errCopy = { ...errors };
    delete errCopy["password"];
    setErrors(errCopy);
    setPassword({ ...password, password: currentValue });
  };

  const onChangeValidatePassword = (e) => {
    const currentValue = e.target.value;
    // const errCopy = { ...errors };
    // delete errCopy["passwordRepeat"];
    setPassword({ ...password, passwordRepeat: currentValue });
  };

  const onChange = (e) => {
    const { id, value } = e.target;
    const errCopy = { ...errors };
    delete errCopy[id];
    setErrors(errCopy);
    setData({ ...data, [id]: value });
  };

  let disabled = true;
  if (password.password && password.passwordRepeat) {
    disabled = password.password !== password.passwordRepeat;
  }

  let passwordMismatch =
    password.password !== password.passwordRepeat ? "Password mismatch" : "";

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("api/1.0/users", {
        username: data.username,
        email: data.email,
        password: password.password,
      });
      setSignUpSuccess(true);
    } catch (error) {
      if (error.response.status === 400) {
        setErrors(error.response.data.validationErrors);
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="signup-page"
    >
      {!signUpSuccess && (
        <form className="card" data-testid="form">
          <div className="card-header">
            <h1 className="text-center">Sign Up</h1>
          </div>
          <div className="card-body">
            <Input
              id="username"
              label="Username"
              onChange={onChange}
              help={errors.username}
            />
            <div className="mb-3">
              <Input
                id="email"
                label="E-mail"
                onChange={onChange}
                help={errors.email}
              />
            </div>
            <div className="mb-3">
              <Input
                id="password"
                label="Password"
                onChange={onChangePassword}
                help={errors.password}
                type="password"
              />
            </div>
            <div className="mb-3">
              <Input
                id="passwordValidation"
                type="password"
                label="Validate Password"
                onChange={onChangeValidatePassword}
                help={passwordMismatch}
              />
            </div>
            <div className="text-center">
              <ButtonWithProgress
                disabled={disabled}
                onClick={submit}
                loading={loading}
              >
                Sign Up
              </ButtonWithProgress>
            </div>
          </div>
        </form>
      )}
      {signUpSuccess && (
        <Alert>Please check your e-mail to activate your account</Alert>
      )}
    </div>
  );
};

export default SignUpPage;
