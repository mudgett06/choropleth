import passport from "passport";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((req, id, done) => {
  req.db
    .collection(process.env.USERS_COLLECTION)
    .findOne({ _id: id })
    .then((user) => done(null, user));
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await req.db
        .collection(process.env.USERS_COLLECTION)
        .findOne({ $or: [{ email: username }, { username }] });
      if (user && (await bcrypt.compare(password, user.password))) {
        done(null, user);
      } else done(null, false, { message: "Email or password is incorrect" });
    }
  )
);
export default passport;
