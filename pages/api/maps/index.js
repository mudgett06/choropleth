import { extractUser } from "../../../lib/api/users";
import { ObjectId } from "mongodb";
import nc from "next-connect";
import database from "../../../middleware";
import bodyParser from "body-parser";

const handler = nc();
handler.use(database);
handler.use(bodyParser.json({ sizeLimit: "50mb", limit: "50mb" }));

export const config = {
  api: {
    bodyParser: false,
  },
};

handler.get(async (req, res) => {
  const { search, pageNumber, nPerPage, detail } = req.query || {};
  const user = extractUser(req);
  let searchObj = {};
  let pipeline = [
    {
      $project: {
        _id: 1,
      },
    },
  ];
  if (detail) {
    pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          thumbnail: 1,
          name: 1,
          tags: 1,
          owner: {
            _id: 1,
          },
        },
      },
    ];
  }
  if (search) {
    searchObj.$text = { $search: search };
  }
  let cursor = await req.db
    .collection(process.env.MAPS_COLLECTION)
    .aggregate([
      {
        $match: {
          ...searchObj,
          $or: [{ owner: ObjectId(user?.username) }, { publish: true }],
        },
      },
      ...pipeline,
    ])
    .sort(search ? { score: { $meta: "textScore" } } : { name: 1 })
    .skip(pageNumber && pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage || Number.MAX_SAFE_INTEGER)
    .toArray()
    .catch((err) => {
      res.json({ err });
    });
  return res.json(cursor);
});

handler.post(async (req, res) => {
  const update = await req.db.collection("maps").insertOne({
    ...req.body,
    owner: req.user.username,
    features: req.body.features.map((feat) => ({
      ...feat,
      _id: ObjectId(feat._id),
    })),
  });
  return res.json({
    _id: update.ops[0]._id.toString(),
  });
});

export default handler;
