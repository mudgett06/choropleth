import { useRouter } from "next/router";
import Layout from "../components/Layout.js";
import { useUser } from "../lib/hooks.js";
import Link from "next/link";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [user, { mutate }] = useUser();
  const router = useRouter();
  useEffect(() => {
    if (user?.username) {
      router.push(`/users/${user.username}/maps`);
    }
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h1>Welcome to Choropleth.net!</h1>
        <p>
          Sign in to get started making maps. Check out the{" "}
          <Link href="/instructions">
            <a>instructions</a>
          </Link>{" "}
          for an overview of the map-editing process.
        </p>
      </div>
    </Layout>
  );
}
