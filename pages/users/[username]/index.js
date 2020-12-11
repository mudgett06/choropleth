import { useRouter } from "next/router";

export default function User({ username }) {
  const router = useRouter();
  router.push(`/users/${username}/maps`);
  return <></>;
}
