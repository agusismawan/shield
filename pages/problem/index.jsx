import Link from "next/link";
import Head from "next/head";
import { useMemo } from "react";
import Layout from "../../components/layout";
import PageHeader from "../../components/problems/page-header";
import format from "date-fns/format";
import ProblemTables from "components/problems/problem-tables";
import {
  PriorityArrow,
  SourcePill,
  StatusPill,
} from "components/problems/status-badge";
import withSession from "../../lib/session";
import { PlusSmIcon, BanIcon, EyeIcon } from "@heroicons/react/outline";
import { PrimaryAnchorButton } from "components/ui/button/primary-anchor-button";
import { SecondaryAnchorButton } from "components/ui/button";

export const getServerSideProps = withSession(async function ({ req, res }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  } else if (user.username === "denisukma") {
    return {
      redirect: {
        destination: "/problem/list",
        permanent: false,
      },
    };
  }
  const getTask = await fetch("http://127.0.0.1:3030/v1/probman/problem/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userSession: user.id,
    }),
  });
  const taskData = await getTask.json();

  if (taskData.status === 200) {
    return {
      props: {
        user: user,
        task: taskData.data.filter((task) => task.idStatus !== 4),
        done: taskData.data.filter((task) => task.idStatus === 4),
      },
    };
  } else {
    return {
      props: {
        user: user,
        task: null,
      },
    };
  }
});

export default function TaskList({ user, task, done }) {
  // begin of define column
  const columns = useMemo(
    () => [
      {
        Header: "No.",
        Cell: (row) => {
          return <div>{Number(row.row.id) + 1}</div>;
        },
      },
      {
        Header: "Priority and Source",
        accessor: "mapping and source",
        Cell: (props) => {
          return (
            <>
              <div style={{ textAlign: "-webkit-center" }}>
                <PriorityArrow
                  value={props.row.original.priorityMatrix.mapping}
                />
                <SourcePill
                  value={
                    props.row.original.problemSource.label.startsWith("Nota")
                      ? props.row.original.problemSource.label.slice(13)
                      : props.row.original.problemSource.label
                  }
                />
              </div>
            </>
          );
        },
        disableSortBy: true,
      },
      {
        Header: "Problem Name",
        accessor: "problemName",
        Cell: (props) => {
          return (
            <>
              <div className="text-sm text-gray-500">
                {props.row.original.incidents.length == 0
                  ? "Problem Non Incident"
                  : props.row.original.multipleIncident == "N"
                  ? props.row.original.incidents.map((incident) => {
                      return incident.incidentNumber;
                    })
                  : "Multiple Incident"}{" "}
                |
                <text className="text-gray-600 hover:text-gray-900">
                  {` ${props.row.original.problemNumber}`}
                </text>
              </div>
              <div className="text-base text-gray-900 font-medium">
                {props.row.original.problemName}
              </div>
              <div className="text-xs text-gray-500">
                {format(
                  new Date(props.row.original.createdAt),
                  "d LLLL yyyy hh:mm"
                )}
              </div>
            </>
          );
        },
      },
      {
        Header: "Status",
        accessor: "problemStatus.label",
        Cell: (props) => {
          return (
            <div>
              {props.row.original.jiraProblem !== "" ? (
                <a
                  href={props.row.original.jiraProblem}
                  target="_blank"
                  rel="noreferrer"
                >
                  <StatusPill value={props.row.original.problemStatus.label} />
                </a>
              ) : (
                <StatusPill value={props.row.original.problemStatus.label} />
              )}
            </div>
          );
        },
      },
      {
        Header: "Assigned To",
        accessor: "assigned_to.userName",
        Cell: (props) => {
          return (
            <div className="text-sm text-gray-900">
              {props.row.original.assigned_to ? (
                props.row.original.assigned_to.fullName
              ) : (
                <>
                  <div className="inline-flex">
                    Not Yet Assigned
                    <BanIcon className="pl-1 h-5 w-5" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          );
        },
      },
      {
        Header: "Follow Up Plan",
        Cell: (props) => {
          return (
            <div className="text-sm">
              {props.row.original.followUp
                ? props.row.original.followUp.label
                : "-"}
            </div>
          );
        },
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
                  target="_blank"
                  rel="noreferrer"
                >
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </>
          );
        },
      },
    ],
    []
  );
  // end of define column

  return (
    <>
      <Layout key="LayoutProblem" session={user}>
        <Head>
          <title>My Task</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="My Task">
            <Link href="/problem/create" passHref>
              <SecondaryAnchorButton>
                <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Problem
              </SecondaryAnchorButton>
            </Link>
            <Link href="/problem/list" passHref>
              <PrimaryAnchorButton>
                <EyeIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                All Problem List
              </PrimaryAnchorButton>
            </Link>
          </PageHeader>

          {/* Problem Tables on Going */}
          <div className="hidden sm:block mt-3">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <text className="text-2xl font-medium text-gray-900">
                Ongoing
              </text>
              <ProblemTables columns={columns} data={task} />
            </div>
          </div>

          {/* Problem Tables Done */}
          <div className="hidden sm:block mt-3">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <text className="text-2xl font-medium text-gray-900">Done</text>
              <ProblemTables columns={columns} data={done} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
