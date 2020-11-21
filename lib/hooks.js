import useSWR from "swr";
import fetch from "unfetch";

const fetcher = (url) => fetch(url).then((r) => r.json());

export function useUser() {
  const { data, mutate } = useSWR("/api/users/active", fetcher);
  const user = data && data.user;
  return [user, { mutate }];
}
