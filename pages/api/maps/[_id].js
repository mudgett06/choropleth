import nc from "next-connect";
import database from "../../../middleware";
import { ObjectId } from "mongodb";
import { getMapById, deleteMap } from "../../../lib/db";
import bodyParser from "body-parser";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = nc();
handler.use(database);
handler.use(bodyParser.json({ sizeLimit: "50mb", limit: "50mb" }));

handler.get(
  async (req, res) =>
    new Promise((resolve, reject) => {
      getMapById(req, req.query?._id)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Cache-Control", "max-age=180000");
          res.end(JSON.stringify(response));
          resolve();
        })
        .catch((error) => {
          res.json(error);
          res.status(405).end();
          resolve();
        });
    })
);

handler.patch(async (req, res) => {
  const owner = await req.db
    .collection("maps")
    .findOne(
      { _id: ObjectId(req.query._id) },
      { projection: { _id: 0, owner: 1 } }
    );
  if (req.user && req.user.username === owner.owner) {
    return await req.db
      .collection("maps")
      .updateOne(
        { _id: ObjectId(req.query._id) },
        {
          $set: { ...req.body, updated: Date.now() },
        }
      )
      .then((result, err) =>
        err ? res.json(err) : res.json({ ok: result.ok })
      );
  } else {
    return res.status(401).send("Unauthorized");
  }
});

handler.delete(async (req, res) => {
  res.json(await deleteMap(req, req.query._id));
});

export default handler;
