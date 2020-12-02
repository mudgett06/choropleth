import axios from "axios";

export async function deleteMap(_id) {
  return axios.delete(`/api/maps/${_id}`).then((res) => res.data);
}