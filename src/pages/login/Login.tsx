import React, { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";

import { authAtom, login } from "@/recoil/atoms/auth.ts";
import { LoginForm } from "@/types/interface/AuthData.ts";
import "../../styles/login.scss";
import { useErrorModal } from "@/hooks/useCustomModal.ts";

const Login: React.FC = () => {
  // atoms
  const setAuthState = useSetRecoilState(authAtom);
  // var
  const { openError } = useErrorModal();
  const navigate = useNavigate();
  // state
  const [formData, setFormData] = useState<LoginForm>({
    userId: "super_admin",
    password: "Dza3$23!2$#",
  });
  const [loading, setLoading] = useState(false);

  // fn
  // input
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // enter & click
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const authInfo = await login(formData.userId, formData.password);

      setAuthState(authInfo);
      setLoading(false);
      navigate("/home");
    } catch (err) {
      setLoading(false);
      openError({
        code: undefined,
        message: err as string,
        url: "로그인",
      });
    }
  };

  return (
    <div className="login-container">
      <img alt="ICTK" className="login-img" src={"ictk-bg.png"} />
      <div className="login-content">
        <h2 className="login-title">
          <span>ICTK 발급 장비</span>
          <br />
          관리자 페이지
        </h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-form-item">
            <span>ID</span>
            <input
              autoComplete="off"
              name="userId"
              type="text"
              value="super_admin"
              onChange={handleChange}
            />
          </div>
          <div className="login-form-item">
            <span>PW</span>
            <input
              autoComplete="off"
              name="password"
              type="password"
              value="Dza3$23!2$#"
              onChange={handleChange}
            />
          </div>
          <Button
            className={`login-form-btn ${loading ? "loading" : ""}`}
            color="primary"
            disabled={
              formData?.userId === "" || formData?.password === "" || loading
            }
            isLoading={loading}
            radius="sm"
            type="submit"
          >
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
