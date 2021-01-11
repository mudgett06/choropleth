import Head from "next/head";
import { useState, useEffect } from "react";
import Map from "../../../components/Map";
import nc from "next-connect";
import database from "../../../middleware/database";
import { getMapShellById } from "../../../lib/db";
import Layout from "../../../components/Layout";
import Link from "next/link";

import axios from "axios";

export default function MapPage({ mapShell }) {
  const [map, setMap] = useState(mapShell);
  useEffect(() => {
    if (!map.geojson) {
      if (!window.sessionStorage[mapShell._id]) {
        axios.get(`/api/maps/${mapShell._id}`).then((res) => {
          window.sessionStorage.setItem(
            mapShell._id,
            JSON.stringify({ ...map, ...res.data })
          );
          setMap({ ...map, ...res.data });
        });
      } else {
        setMap(JSON.parse(window.sessionStorage[mapShell._id]));
      }
    }
  }, []);
  return (
    <>
      <Head>
        <title>{map.name}</title>
      </Head>
      <h1 style={{ margin: "0.25rem 0" }}>{map.name}</h1>
      {map.owner ? (
        <h2 style={{ margin: "0.25rem 0", fontWeight: "normal" }}>
          By{" "}
          <Link href={`/users/${map.owner}/maps`}>
            <a>{map.owner}</a>
          </Link>
        </h2>
      ) : (
        <></>
      )}
      <Map map={map} />
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const handler = nc().use(database);
  await handler.run(req, res);
  const mapShell = await getMapShellById(req, params._id);
  return { props: { mapShell } };
}
