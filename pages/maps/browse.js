import { getAllMaps, getAllMapIds } from "../../lib/maps";

export default function BrowseMaps({ allMaps }) {}

export async function getStaticPaths() {
  const paths = getAllMapIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const allMaps = getAllMaps();
  return {
    props: {
      allMaps,
    },
  };
}
