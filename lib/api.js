import axios from "axios";

export function extractUser(req) {
    if (!req.user) return null;
    const { _id, email, username } = req.user;
    return {
      _id: _id.toString(),
      email,
      username,
    };
  }

export async function deleteMap(_id) {
  return axios.delete(`/api/maps/${_id}`).then((res) => res.data);
}

export async function logout(mutate) {
    await axios.post("/api/auth/logout", {}).then(() => mutate(null));
  }
  
  export async function login(mutate, credentials) {
    return await axios
      .post("/api/auth/login", credentials)
      .then((result) => {
        if (result.data.user?._id) {
          mutate(result.data);
        }
        return result.data.user;
      })
      .catch((err) => {
        return null;
      });
  }
  
  export async function register(mutate, credentials) {
    return await axios
      .post("/api/auth/register", credentials)
      .then((response) => {
        if (response.status == 200) {
          mutate(response.data);
        }
        return response;
      })
      .catch((err) => {
        return { err: err.response.data };
      });
  }
  