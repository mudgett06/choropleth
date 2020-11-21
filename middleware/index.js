import nc from "next-connect";
import database from "./database";
import session from "./session";
import passport from "../lib/api/passport";

const handler = nc();

export default handler
  .use(database)
  .use(session)
  .use(passport.initialize())
  .use(passport.session());
