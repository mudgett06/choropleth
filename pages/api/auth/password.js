import nextConnect from "next-connect";
import bcrypt from "bcryptjs";
import middleware from "../../../middleware";

const handler = nextConnect();
handler.use(middleware);

handler.put(async (req, res) => {
  try {
    if (!req.user) throw new Error("You need to be logged in.");
    const { currentPassword, newPassword } = req.body;
    if (!(await bcrypt.compare(currentPassword, req.user.password))) {
      throw new Error("Current password is incorrect.");
    }
    const password = await bcrypt.hash(newPassword, 10);
    await req.db
      .collection("users")
      .updateOne({ _id: req.user._id }, { $set: { password } });
    res.json({ success: true, text: "Password updated." });
  } catch (error) {
    res.json({
      success: false,
      text: error.toString(),
    });
  }
});

export default handler;
