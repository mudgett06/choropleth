import axios from "axios";

export async function logout(mutate) {
  await axios.post("/api/auth/logout", {}).then(() => mutate(null));
}

export async function login(mutate, credentials) {
  return await axios
    .post("/api/auth/login", credentials)
    .then((res) => {
      if (res.data.user) {
        mutate(res.data);
      }
      return res.data;
    })
    .catch(() => ({
      message: "Incorrect Credentials",
      fields: ["username", "password"],
    }));
}

export async function register(mutate, credentials) {
  return await axios
    .post("/api/auth/register", credentials)
    .then((response) => {
      if (response.status == 200) {
        mutate(response.data);
      }
      return response.data;
    })
    .catch((err) => {
      return { message: err.data, fields: ["email"] };
    });
}

export async function checkCredential(credential, currentPassword) {
  return password
    ? await axios
        .put("/api/auth/password", {
          currentPassword,
          newPassword: credential.password,
        })
        .then((res) => res.data)
    : await axios.put("/api/auth/check", credential).then((res) => res.data);
}
