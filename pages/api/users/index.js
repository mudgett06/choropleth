import handler from "../../../middleware";

export default handler.get(async (req, res) => {
  const cursor = await req.db
    .collection(process.env.USERS_COLLECTION)
    .find({}, { settings: 0, maps: 0, email: 0 });
  return res.json(cursor.map((usr) => usr._id.toString()));
});
