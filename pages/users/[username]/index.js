import { useRouter } from "next/router";

export default function User({ username }) {
  router = useRouter();
  router.push(`/users/${username}/maps`);
  return <></>;
}
