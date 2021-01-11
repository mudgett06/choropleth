import { useRouter } from "next/router";
import Layout from "../components/Layout.js";
import { useUser } from "../lib/hooks.js";
import Link from "next/link";
import { useEffect } from "react";
import styles from "../styles/components.module.css";

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
      <div className={styles.contentBox}>
        <h1>Welcome to Choropleth.net!</h1>
        <p>
          <Link href="/login">
            <a>Sign in</a>
          </Link>{" "}
          to get started making maps. Check out the{" "}
          <Link href="/instructions">
            <a>instructions</a>
          </Link>{" "}
          for an overview of the map-editing process.
        </p>
        <p>
          Choropleth.net is a quick way to visualize your geographical data.
          Check out the interactive map below to see what you can create in
          minutes by dragging and dropping a CSV file!
        </p>
        <iframe
          src="https://choropleth.net/maps/5fceaa72f135e4661d2f5593/embed"
          frameborder="0"
        ></iframe>
      </div>
    </Layout>
  );
}
