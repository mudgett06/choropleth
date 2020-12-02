import Head from "next/head";
import { useUser } from "../lib/hooks";
import styles from "./layout.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../lib/api/auth";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Layout({ children }) {
  const router = useRouter();
  const [user, { mutate }] = useUser();
  return (
    <div className={styles.container}>
      <Head>
        <title>Choropleth.net</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <nav>
        <ul className={styles.topLevelNav}>
          <li key="home">
            <Link href="/">
              <a>Choropleth.net</a>
            </Link>
          </li>
          <li key="instructions">
            <Link href="/instructions">
              <a>Instructions</a>
            </Link>
          </li>
          {user ? (
            <>
              <li key="myMaps">
                <Link href={`/users/${user.username}/maps`}>
                  <a>My Maps</a>
                </Link>
              </li>
              <li key="logout">
                <Link href={"/"}>
                  <a
                    onClick={() => {
                      logout(mutate).then(() => router.push("/"));
                    }}
                  >
                    Log Out
                  </a>
                </Link>
              </li>
              <li key="userSettings">
                <Link href={`/users/${user.username}/settings`}>
                  <a>Settings</a>
                </Link>
              </li>
            </>
          ) : (
            <Link href="/login">
              <a>Login/Register</a>
            </Link>
          )}
        </ul>
      </nav>

      {children}

      <footer className={styles.footer}></footer>
    </div>
  );
}
