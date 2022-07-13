import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { login } from "../api/apiCalls";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { useNavigate } from "react-router-dom";
import { onLoginSuccess } from "../slices/authSlice";
import { useDispatch } from "react-redux";

const LoginPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState({
    password: "",
  });

  const [data, setData] = useState({
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    message: "",
  });

  useEffect(() => {
    setErrors({ ...errors, message: "" });
  }, [data.email, password.password]);

  const onChangePassword = (e) => {
    const currentValue = e.target.value;
    setPassword({ ...password, password: currentValue });
  };

  const onChange = (e) => {
    const { id, value } = e.target;
    setData({ ...data, [id]: value });
  };

  let disabled = true;
  if (password.password !== "" && data.email !== "") {
    disabled = false;
  }

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({
        email: data.email,
        password: password.password,
      });
      dispatch(
        onLoginSuccess({
          ...response.data,
          header: `Bearer ${response.data.token}`,
        })
      );
      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        setErrors(error.response.data);
      }
      setLoading(false);
    }
  };

  return (
    <div
      className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
      data-testid="login-page"
    >
      <form className="card" data-testid="form">
        <div className="card-header">
          <h1 className="text-center">Login</h1>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <Input id="email" label="E-mail" onChange={onChange} />
          </div>
          <div className="mb-3">
            <Input
              id="password"
              label="Password"
              onChange={onChangePassword}
              type="password"
            />
          </div>
          {errors.message && <Alert type="danger">{errors.message}</Alert>}
          <div className="text-center">
            <ButtonWithProgress
              disabled={disabled}
              loading={loading}
              onClick={submit}
            >
              Login
            </ButtonWithProgress>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
