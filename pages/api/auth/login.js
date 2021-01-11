import handler from "../../../middleware";
import { extractUser } from "../../../lib/api/users";
import passport from "../../../lib/api/passport";

export default handler.post(
  passport.authenticate("local"),
  async (req, res) => {
    return req.user
      ? res.json(extractUser(req))
      : res.status(403).send("Incorrect Credentials");
  }
);
