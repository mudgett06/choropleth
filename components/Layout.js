import Head from "next/head";
import { useUser } from "../lib/hooks";
import styles from "./layout.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { logout } from "../lib/api/auth";
import { config, dom } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

export default function Layout({ children }) {
  const navLink =
    "hover:no-underline hover:border-gray-800 hover:border text-gray-800";
  const router = useRouter();
  const [user, { mutate }] = useUser();
  return (
    <>
      <Head>
        <title>Choropleth.net</title>
        <link rel="icon" href="/favicon.ico" />
        <style>{dom.css()}</style>
      </Head>
      <nav>
        <ul className={styles.topLevelNav}>
          <li key="home">
            <Link href="/">
              <a className={navLink}>Choropleth.net</a>
            </Link>
          </li>
          <li key="instructions">
            <Link href="/instructions">
              <a className={navLink}>Instructions</a>
            </Link>
          </li>
          {user ? (
            <>
              <li key="myMaps">
                <Link href={`/users/${user.username}/maps`}>
                  <a className={navLink}>My Maps</a>
                </Link>
              </li>
              <li key="logout">
                <Link href={"/"}>
                  <a
                    className={navLink}
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
                  <a className={navLink}>Settings</a>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li key="Create">
                <Link href="/maps/create">
                  <a className={navLink}>Create</a>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <a className={navLink}>Login/Register</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className={styles.container}>{children}</div>
      <footer className={styles.footer}></footer>
    </>
  );
}
