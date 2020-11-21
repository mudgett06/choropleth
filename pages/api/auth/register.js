import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcryptjs";
import handler from "../../../middleware";
import { extractUser } from "../../../lib/api/users";

// POST /api/users
export default handler.post(async (req, res) => {
  const { password, password2, username } = req.body;
  const email = normalizeEmail(req.body.email);
  if (!isEmail(email)) {
    res.status(400).send("The email you entered is invalid.");
    return;
  }
  if (
    (await req.db
      .collection(process.env.USERS_COLLECTION)
      .countDocuments({ email })) > 0
  ) {
    res.status(403).send("The email has already been used.");
    return;
  }
  if (
    (await req.db
      .collection(process.env.USERS_COLLECTION)
      .countDocuments({ username })) > 0
  ) {
    res.status(403).send("Username is taken");
    return;
  }
  if (!password || !username) {
    res.status(400).send("Missing field(s)");
    return;
  }
  if (password !== password2) {
    res.status(400).send("Passwords do not match");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await req.db
    .collection(process.env.USERS_COLLECTION)
    .insertOne({
      email,
      password: hashedPassword,
      username,
      joined: Date.now(),
    })
    .then(({ ops }) => ops[0]);
  req.logIn(user, (err) => {
    if (err) throw err;
    return res.status(201).json({
      user: extractUser(req),
    });
  });
});
