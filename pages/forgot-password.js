import React from "react";
import AuthForm from "../components/AuthForm";

export default function forgotPassword() {
  const fields = [{ id: "email", type: "email", placeholder: "Email" }];
  return (
    <AuthForm
      authType={"recoverPassword"}
      title={"Enter email to recover password"}
      fields={fields}
      buttonText={"Send Recovery Email"}
      loadingText={""}
    ></AuthForm>
  );
}
