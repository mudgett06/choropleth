export function getAllUserIds() {
  let users;
  axios.get("/api/users").then((result) => {
    users = result.data;
  });
  return users;
}

export function getUserById(_id) {
  let user;
  axios.get(`/api/users/${_id}`).then((result) => {
    user = result.data;
  });
}

export function extractUser(req) {
  if (!req.user) return null;
  const { _id, email, username } = req.user;
  return {
    _id: _id.toString(),
    email,
    username,
  };
}
