import handler from "../../../middleware";
import { extractUser } from "../../../lib/api/users";
import passport from "../../../lib/api/passport";

export default handler.post(
  passport.authenticate("local"),
  async (req, res) => {
    return res.json({ user: extractUser(req) });
  }
);
