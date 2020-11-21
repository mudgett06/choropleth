import axios from "axios";

export async function deleteMap(_id) {
  return axios.delete(`/api/maps/${_id}`).then((res) => res.data);
}

export async function loadFullMap(_id) {
  return axios.get(`/api/maps/${_id}/`).then((res) => res.data);
}
