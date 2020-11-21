import handler from "../../../middleware";
import { extractUser } from "../../../lib/api/users";

export default handler.get(async (req, res) => {
  console.log("gotActiveUser");
  return res.json({ user: extractUser(req) });
});
