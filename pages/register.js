import AuthForm from "../components/AuthForm";

export default function Register() {
  const fields = [
    { id: "email", type: "email", placeholder: "Email" },
    { id: "username", type: "text", placeholder: "Username" },
    { id: "password", type: "password", placeholder: "Password" },
    { id: "password2", type: "password", placeholder: "Retype Password" },
  ];

  return (
    <AuthForm
      authType="register"
      title="Create an Account"
      buttonText={"Register"}
      loadingText={"Creating Account..."}
      fields={fields}
    ></AuthForm>
  );
}
