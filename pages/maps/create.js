import Head from "next/head";
import Layout from "../../components/Layout";
import FileUpload from "../../components/FileUpload";
export default function CreateMap() {
  return (
    <Layout>
      <Head>
        <title>{`Create a New Map`}</title>
      </Head>
      <div
        className={`w-80 h-80 m-auto mt-6 border border-gray-300 shadow-lg rounded-md p-4`}
      >
        <FileUpload />
      </div>
    </Layout>
  );
}
