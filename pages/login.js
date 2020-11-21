import { useEffect, useState, useRef } from "react";
import isEmail from "validator/lib/isEmail";
import { login } from "../lib/api/auth";
import Layout from "../components/Layout";
import { useUser } from "../lib/hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/authForms.module.css";
import { css } from "@emotion/core";
import DotLoader from "react-spinners/DotLoader";

export default function Login() {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const router = useRouter();
  const [user, { mutate }] = useUser();
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const usernameRef = useRef();
  const passwordRef = useRef();
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {!loadingUser ? "Sign in" : "Signing in..."}
        </h1>
        {loadingUser ? (
          <DotLoader css={override} size={60} color={"#4A4A4A"} />
        ) : (
          <form className={styles.form}>
            <input
              className={styles.field}
              id="username"
              name="username"
              type="text"
              placeholder="Username or Email"
              ref={usernameRef}
            />
            <input
              className={styles.field}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              ref={passwordRef}
            />
            {errorMessage ? (
              <p className={`${styles.paragraph} ${styles.error}`}>
                Invalid username or password
              </p>
            ) : (
              <></>
            )}
            <p className={`${styles.paragraph}`}>
              Don't have an account?{" "}
              <Link href="/register">
                <a className={styles.switchFormLink}>Sign up</a>
              </Link>
            </p>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setLoadingUser(true);
                login(mutate, {
                  username: usernameRef.current.value,
                  password: passwordRef.current.value,
                }).then((user) => {
                  if (user) {
                    router.push(`/users/${user.username}/maps`);
                  } else {
                    setLoadingUser(false);
                    setErrorMessage(true);
                  }
                });
              }}
              className={styles.submit}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}
