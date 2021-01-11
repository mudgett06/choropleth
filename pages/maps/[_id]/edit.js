import MapEditor from "../../../components/MapEditor";
import nc from "next-connect";
import database from "../../../middleware/database";
import { getMapShellById } from "../../../lib/db";
import Layout from "../../../components/Layout";
import { useUser } from "../../../lib/hooks";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditMap({ mapShell }) {
  const [user, { mutate }] = useUser();
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
  const router = useRouter();
  if (mapShell.owner != user?.username) {
    //router.push(`/maps/${map._id.toString()}`);
  }
  return (
    <Layout>
      <MapEditor map={map} />
    </Layout>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const handler = nc().use(database);
  await handler.run(req, res);
  const mapShell = await getMapShellById(req, params._id);
  return { props: { mapShell } };
}
