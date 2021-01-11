import Head from "next/head";
import database from "../../../middleware/database";
import nc from "next-connect";
import { getMapsByUsername } from "../../../lib/db";
import Layout from "../../../components/Layout";
import { useUser } from "../../../lib/hooks";
import MapCollection from "../../../components/MapCollection";
import FileUpload from "../../../components/FileUpload";
export default function UserMaps({ maps, pageUsername }) {
  const [user, { mutate }] = useUser();
  return (
    <Layout>
      <Head>
        <title>{`${pageUsername.toProperCase()}'s Maps`}</title>
      </Head>
      <div
        style={{
          width: "80%",
          height: "80%",
          margin: "auto",
          marginTop: "1.5rem",
          border: "1px solid gainsboro",
          boxShadow: "3px 3px 10px -5px rgba(0,0,0,0.75)",
          borderRadius: "5px",
          padding: "1rem",
        }}
      >
        {user?.username === pageUsername ? (
          <div
            style={{
              display: "flex",
              flexDirection: maps.length ? "row" : "column",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {maps?.length ? (
              <MapCollection
                maps={maps}
                owner={user?.username === pageUsername}
              />
            ) : (
              <p>You don't have any maps yet. Create one now!</p>
            )}
            <FileUpload username={user?.username} />
          </div>
        ) : maps?.length ? (
          <MapCollection maps={maps} owner={user?.username === pageUsername} />
        ) : (
          <p>User has no maps to display</p>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const handler = nc().use(database);
  try {
    await handler.run(req, res);
  } catch (e) {}
  const maps = await getMapsByUsername(req, params.username);
  return { props: { maps, pageUsername: params.username } };
}
