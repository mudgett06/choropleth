import { useState, useRef } from "react";
import Layout from "./Layout";
import styles from "../styles/components.module.css";
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { mutate } from "swr";
import { login } from "../lib/api/auth";

export default function AuthForm({
  authType,
  title,
  fields,
  buttonText,
  loadingText,
}) {
  const router = useRouter();
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [formState, setFormState] = useState(null);
  const handleSubmit = async (e) => {
    setFormState(
      fields.reduce(
        (obj, field) => ({
          ...obj,
          [field.id]: e.currentTarget[field.id].value,
        }),
        {}
      )
    );
    e.preventDefault();
    setLoading(true);
    const blankFields = fields.filter(
      (field) => !e.currentTarget[field.id].value
    );
    if (blankFields.length) {
      setErrorState({
        message: `${blankFields
          .map((field) => field.placeholder)
          .join(", ")} must not be blank`,
        fields: blankFields.map((field) => field.id),
      });
      setLoading(false);
      return false;
    }
    if (
      e.currentTarget.password2 &&
      e.currentTarget.password.value !== e.currentTarget.password2.value
    ) {
      setErrorState({
        fields: ["password", "password2"],
        message: "Passwords do not match",
      });
      setLoading(false);
      return false;
    }
    const credentials = fields.reduce(
      (obj, field) =>
        field.id === "password2"
          ? obj
          : {
              ...obj,
              [field.id]: e.currentTarget[field.id].value,
            },
      {}
    );
    return await axios
      .post(`/api/auth/${authType}`, credentials)
      .then((res) => {
        if (res.data.username) {
          mutate(res.data);
          router.push(`/users/${res.data.username}/maps`);
        } else {
          console.log("error");
        }
      })
      .catch((err) => {
        setErrorState({
          message: err.response.data,
          fields: err.response.data.toLowerCase().match(/username|email/gi),
        });
        setLoading(false);
        return false;
      });
  };

  return (
    <Layout>
      <div
        className={`${styles.contentBox} text-center justify-center items-center`}
      >
        <h1>{!loading ? title : loadingText}</h1>
        {loading ? (
          <DotLoader css={override} size={60} color={"#4A4A4A"} />
        ) : (
          <form
            className="flex flex-col w-2/3 items-center justify-center"
            onSubmit={handleSubmit}
          >
            {fields.map((field) => {
              return (
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  defaultValue={formState ? formState[field.id] : ""}
                  placeholder={field.placeholder}
                  className={
                    errorState?.fields?.indexOf(field.id) > -1
                      ? "border-red-700"
                      : ""
                  }
                />
              );
            })}
            {errorState ? (
              <p className={"text-red-700"}>{errorState.message}</p>
            ) : null}
            {/*authType === "login" ? (
              <Link href="/forgot-password">
                <a>Forgot password?</a>
              </Link>
            ) : null*/}
            {["login", "register"].indexOf(authType) > -1 ? (
              <Link href={authType === "login" ? "/register" : "/login"}>
                <a>
                  {authType === "login"
                    ? "Create an Account"
                    : "Already have an account? Sign in"}
                </a>
              </Link>
            ) : (
              <></>
            )}
            <button type="submit">{buttonText}</button>
          </form>
        )}
      </div>
    </Layout>
  );
}
