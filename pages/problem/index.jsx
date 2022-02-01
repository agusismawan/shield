import Head from "next/head"
import Layout from "../../components/layout"
import PageHeader from "../../components/problems/page-header"
import CardHeader from "../../components/problems/card-header"
import ProblemTables from "components/problems/problem-tables"
import { EyeIcon } from "@heroicons/react/solid"
import { useMemo } from "react"
import format from "date-fns/format"
import { PriorityArrow, SourcePill, StatusPill, StatusText, StatusIncident } from "../../components/problems/status-badge"
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

  const resAllJoin = await fetch(
    "http://127.0.0.1:3030/v1/probman/problem/alljoin"
  )
  const problems = await resAllJoin.json()
  
  return {
    props: {
      user: user,
      problems: problems.data,
    },
  }
})

export default function ProblemList({ user, problems }) {
  // begin define column
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        Cell: (row) => {
          return <div>{Number(row.row.id) + 1}</div>
        },
      },
      {
        Header: "Priority and Source",
        accessor: "mapping and source",
        Cell: (props) => {
          return (
            <>
              <div style={{ textAlign: "-webkit-center" }}>
                <PriorityArrow value={props.row.original.priorityMatrix.mapping} />
                <SourcePill value={props.row.original.rootCause.source} />
              </div>
            </>
          )
        },
        disableSortBy: true
      },
      {
        Header: "Problem Name",
        accessor: "problemName",
        Cell: (props) => {
          return (
            <>
              <div className="text-sm text-gray-500">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  {props.row.original.incident
                    ? props.row.original.incident.incidentNumber
                    : "Tidak ada Incident"}
                </a>
                {` | PR-${props.row.original.id}-${format(new Date(props.row.original.createdAt), "MMddyy")}`}
              </div>
              <div className="text-base text-gray-900">
                {props.row.original.problemName}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(props.row.original.createdAt), "d LLLL yyyy hh:mm")}
              </div>
            </>
          )
        }
      },
      {
        Header: "Status",
        accessor: "status",
        // Filter: balbalblabla,
        // filter: 'includes',
        Cell: (props) => {
          return (
            <div>
              <StatusPill value={props.row.original.status} />
              <br />
              {props.row.original.incident.incidentNumber}
            </div>
          )
        }
      },
      {
        Header: "Followup By",
        accessor: "user.fullName",
        Cell: (props) => {
          return (
            <div className="text-sm text-gray-900">
              {props.row.original.user.fullName ? props.row.original.user.fullName : props.row.original.user.userName}
            </div>
          )
        }
      },
      {
        Header: "Latest Progress",
        Cell: "Get Latest Nich"
      },
      {
        Header: "Detail",
        Cell: (props) => {
          return (
            <>
              <div style={{ textAlign: "-webkit-center" }}>
                <a
                  href={`/problem/${props.row.original.id}`}
                  className="bg-gray-100 text-gray-900"
                >
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </>
          )
        }
      }
    ],
    []
  )
  // end of define table

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
                  problems.filter((status) => status.status === "Draft")
                    .length
                } Draft | ${
                  problems.filter(
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
                  problems.filter(
                    (status) => status.status === "Analyzing RCA"
                  ).length +
                  problems.filter(
                    (status) => status.status === "Approval RCA"
                  ).length
                } Ongoing | ${
                  problems.filter(
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
                  problems.filter(
                    (status) => status.status === "Workaround Implementation"
                  ).length
                } Workaround | ${
                  problems.filter(
                    (status) => status.status === "On Progress Resolution"
                  ).length +
                  problems.filter(
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
                  problems.filter(
                    (status) => status.status === "Need Acknowledged"
                  ).length
                } Acknowledged | ${
                  problems.filter(
                    (status) => status.status === "Problem Solved"
                  ).length
                } Resolved`}
              />
            </ul>
          </div>

          {/* Problem Tables table (small breakpoint and up) */}
          <div className="hidden mt-8 sm:block">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <ProblemTables columns={columns} data={problems} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  )
}
