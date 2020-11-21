import database from "../../middleware/database";
import nc from "next-connect";
import { getGeoids } from "../../lib/db";

const handler = nc();
handler.use(database);

export default handler.post(async (req, res) => res.json(await getGeoids(req)));
