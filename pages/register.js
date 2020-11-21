import { useEffect, useState, useRef } from "react";
import { register } from "../lib/api/auth";
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

  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const password2Ref = useRef();

  useEffect(() => {
    if (user) {
      router.push(`/users/${user.username}/maps`);
    }
  }, [user]);

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>
          {!loadingUser ? "Create an Account" : "Creating Account..."}
        </h1>
        {loadingUser ? (
          <DotLoader css={override} size={60} color={"#4A4A4A"} />
        ) : (
          <form className={styles.form}>
            <input
              className={styles.field}
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              ref={emailRef}
            />
            <input
              className={styles.field}
              id="username"
              name="username"
              type="text"
              placeholder="Username"
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
            <input
              className={styles.field}
              id="password2"
              name="password2"
              type="password"
              placeholder="Retype Password"
              ref={password2Ref}
            />
            {errorMessage ? (
              <p className={`${styles.paragraph} ${styles.error}`}>
                {errorMessage}
              </p>
            ) : (
              <></>
            )}
            <p className={`${styles.paragraph}`}>
              Have an account?{" "}
              <Link href="/login">
                <a className={styles.switchFormLink}>Sign In</a>
              </Link>
            </p>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
              }}
              onClick={() => {
                setLoadingUser(true);
                register(mutate, {
                  email: emailRef.current.value,
                  password: passwordRef.current.value,
                  password2: password2Ref.current.value,
                  username: usernameRef.current.value,
                }).then((response) => {
                  if (response.err) {
                    setErrorMessage(response.err);
                    setLoadingUser(false);
                  } else {
                    router.push(`/users/${response.data.user.username}/maps`);
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
