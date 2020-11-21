import handler from "../../../middleware";

export default handler.post((req, res) => {
  req.logOut();
  return res.status(204).end();
});
