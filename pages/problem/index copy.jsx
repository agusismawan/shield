import Head from "next/head"
import Layout from "../../components/layout"
import PageHeader from "../../components/problems/page-header"
import CardHeader from "../../components/problems/card-header"
import ProblemTables from "../../components/problems/problem-tables"
import axios from "axios"
import withSession from "../../lib/session"
import {
  DocumentAddIcon,
  PuzzleIcon,
  SparklesIcon,
  BadgeCheckIcon,
} from "@heroicons/react/outline"

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user")
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    }
  }

  // res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
  //   headers: { Authorization: `Bearer ${user.accessToken}` },
  // });
  // const data = await res.data;

  const resAllJoin = await fetch(
    "http://127.0.0.1:3030/v1/probman/problem/alljoin"
  )
  const dataProblems = await resAllJoin.json()
  
  return {
    props: {
      user: user,
      problems: dataProblems,
      // data: data.data,
    },
  }
})

export default function ProblemList({ user, problems }) {
  return (
    <>
      <Layout key="LayoutProblem" session={user}>
        <Head>
          <title>All Problem List</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Problem List" />

          {/* Cards */}
          <div className="px-4 mt-6 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
              <CardHeader
                id="1"
                bgColor="bg-gray-500"
                initials={<DocumentAddIcon className="w-6 h-6" />}
                title="Draft and Unassigned"
                desc={`${
                  problems.data.filter((status) => status.status === "Draft")
                    .length
                } Draft | ${
                  problems.data.filter(
                    (status) => status.status === "Unassigned"
                  ).length
                } Unassigned`}
              />
              <CardHeader
                id="2"
                bgColor="bg-yellow-500"
                // style={{backgroundColor: 'green'}}
                initials={<PuzzleIcon className="w-6 h-6" />}
                title="Ongoing RCA"
                desc={`${
                  problems.data.filter(
                    (status) => status.status === "Analyzing RCA"
                  ).length +
                  problems.data.filter(
                    (status) => status.status === "Approval RCA"
                  ).length
                } Ongoing | ${
                  problems.data.filter(
                    (status) => status.status === "Revising RCA"
                  ).length
                } Revising`}
              />
              <CardHeader
                id="3"
                bgColor="bg-blue-500"
                initials={<SparklesIcon className="w-6 h-6" />}
                title="Workaround / Ongoing Resolution"
                desc={`${
                  problems.data.filter(
                    (status) => status.status === "Workaround Implementation"
                  ).length
                } Workaround | ${
                  problems.data.filter(
                    (status) => status.status === "On Progress Resolution"
                  ).length +
                  problems.data.filter(
                    (status) => status.status === "Resolution Review"
                  ).length
                } Resolution`}
              />
              <CardHeader
                id="4"
                bgColor="bg-green-500"
                initials={<BadgeCheckIcon className="w-6 h-6" />}
                title="Done"
                desc={`${
                  problems.data.filter(
                    (status) => status.status === "Need Acknowledged"
                  ).length
                } Acknowledged | ${
                  problems.data.filter(
                    (status) => status.status === "Problem Solved"
                  ).length
                } Resolved`}
              />
            </ul>
          </div>

          {/* <div className="px-4 mt-6 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-12 gap-1 sm:gap-1 sm:grid-cols-1 xl:grid-cols-1 mt-3">
              <AccordionForm apps={apps} incidents={incidents} />
            </ul>
          </div> */}

          {/* Problem Tables table (small breakpoint and up) */}
          <div className="hidden mt-8 sm:block">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <ProblemTables problems={problems} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
