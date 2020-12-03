import middleware from "../../../middleware";
import nc from "next-connect";

const handler = nc();
handler.use(middleware);
const entry = Object.entries(req.body)[0];
handler.put(async (req, res) => {
  if (await req.db.collection("users").findOne(req.body)) {
    res.json({
      success: false,
      text: `Error: ${entry[0]} "${entry[1]}" is in use`,
    });
  } else {
    req.db
      .collection("users")
      .updateOne({ _id: req.user._id }, { $set: { ...req.body } });
    if (entry[0] === "username") {
      req.db
        .collection("maps")
        .updateMany(
          { _id: req.user._id },
          { $set: { owner: req.body.username } }
        );
    }
    res.json({ success: true, text: `${entry[0]} successfully updated` });
  }
});

export default handler;
