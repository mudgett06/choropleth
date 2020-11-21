import Head from "next/head";
import Map from "../../../components/Map";
import nc from "next-connect";
import database from "../../../middleware/database";
import { getMapById } from "../../../lib/db";
import Layout from "../../../components/Layout";

export default function MapPage({ map, owner }) {
  return <Map map={map} embed />;
}

export async function getServerSideProps({ req, res, params }) {
  const handler = nc();
  handler.use(database);
  await handler.run(req, res);
  const { map, owner } = await getMapById(req, params._id);
  return { props: { map, owner } };
}
