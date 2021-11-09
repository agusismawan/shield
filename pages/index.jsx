import Layout from "../components/layout";
import Head from "next/head";
import withSession from "../lib/session";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: { user: req.session.get("user") },
  };
});

function Home({ user }) {
  console.log(user);
  return (
    <>
      <Layout>
        <Head>
          <title>Incident & Problem Management</title>
        </Head>
        <h1>{user.accessToken}</h1>
      </Layout>
    </>
  );
}

export default Home;
