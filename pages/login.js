import AuthForm from "../components/AuthForm";

export default function Login() {
  const fields = [
    { id: "username", type: "text", placeholder: "Username or Email" },
    { id: "password", type: "password", placeholder: "Password" },
  ];

  return (
    <AuthForm
      authType={"login"}
      title={"Sign In to Choropleth.net"}
      fields={fields}
      buttonText={"Login"}
      loadingText={"Signing In..."}
    ></AuthForm>
  );
}
