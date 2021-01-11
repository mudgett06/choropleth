import { useState, useRef } from "react";
import Layout from "../../../components/Layout";
import Message from "../../../components/Message";
import styles from "../../../styles/Settings.module.css";
import { spliceOutCopy, spliceUpdateCopy } from "../../../lib/utility";
import { useUser } from "../../../lib/hooks";
import axios from "axios";
import { checkCredential, login } from "../../../lib/api/auth";

export default function UserSettings() {
  const [state, setState] = useState({
    email: { editing: false, message: null, ref: useRef() },
    username: { editing: false, message: null, ref: useRef() },
    password: { editing: false, message: null, ref: useRef() },
  });
  const [user, { mutate }] = useUser();
  const currentPasswordRef = useRef();

  const updateCredState = (cred, update) =>
    setState({
      ...state,
      [cred]: { ...state[cred], ...update },
    });

  const togglEdit = (cred) =>
    updateCredState(cred, { editing: !state[cred].editing });

  const setMessage = (cred, message) => updateCredState(cred, { message });

  return (
    <Layout>
      <Message></Message>
      <div className={styles.container}>
        <h1>Account Settings</h1>
        {user ? (
          <>
            {["email", "username", "password"].map((loginType) => (
              <>
                {state[loginType].editing ? (
                  <>
                    {loginType === "password" ? (
                      <>
                        <label
                          htmlFor={`currentPassword`}
                        >{`Current Password:`}</label>
                        <input
                          ref={currentPasswordRef}
                          id={`currentPassword`}
                          type="text"
                        />
                      </>
                    ) : (
                      <></>
                    )}
                    <div>
                      <label
                        htmlFor={`new${loginType}`}
                      >{`New ${loginType.toProperCase()}:`}</label>
                      <input
                        defaultValue={user[loginType]}
                        ref={state[loginType].ref}
                        id={`new${loginType}`}
                        type="text"
                      />
                      <button
                        onClick={() => {
                          newCredential = state[loginType].ref.current.value;
                          if (newCredential === user[loginType]) {
                            togglEdit(loginType);
                          } else {
                            checkCredential(
                              {
                                [loginType]: newCredential,
                              },
                              loginType === "password"
                                ? currentPasswordRef.current.value
                                : null
                            ).then((res) => {
                              setMessage(loginType, ...res);
                              if (res.ok) {
                                togglEdit(loginType);
                              }
                              mutate({ [loginType]: newCredential });
                            });
                          }
                        }}
                      >
                        Save
                      </button>
                      <button onClick={() => togglEdit(loginType)}>
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div>
                    {`${loginType.toProperCase()}: ${
                      user[loginType] || "•••••••"
                    } `}
                    <button onClick={() => togglEdit(loginType)}>Edit</button>
                  </div>
                )}

                {state[loginType].message ? (
                  <Message {...state[loginType].message}></Message>
                ) : (
                  <></>
                )}
              </>
            ))}
          </>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
}
