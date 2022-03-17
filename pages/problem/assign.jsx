import Head from "next/head";
import Layout from "../../components/layout";
import PageHeader from "../../components/problems/page-header";
import ProblemTables from "components/problems/problem-tables";
import { EyeIcon } from "@heroicons/react/solid";
import { useEffect, useState, useMemo, useRef } from "react";
import format from "date-fns/format";
import {
  PriorityArrow,
  SourcePill,
} from "../../components/problems/status-badge";
import axios from "axios";
import { useAsyncDebounce } from "react-table";
import withSession from "../../lib/session";
import { toast } from "react-toastify";

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

  const assignProblem = await fetch(
    "http://127.0.0.1:3030/v1/probman/incident/filter"
  );
  const getAssign = await assignProblem.json();

  if (assignProblem.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: user,
        assign: getAssign.data,
      },
    };
  }
  // else {
  //   return {
  //     redirect: {
  //       destination: "/problem",
  //       permanent: false,
  //     },
  //   };
  // }
});

export default function AssignList({ user, assign }) {
  const tableInstance = useRef(null);
  const count = assign.length;

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
                <SourcePill value={props.row.original.problem.problemSource.label} />
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
                <text className="text-indigo-600 hover:text-indigo-900">
                  {props.row.original.incidentNumber}
                </text>
                {` | ${props.row.original.problem.problemNumber}`}
              </div>
              <div className="text-base text-gray-900">
                {props.row.original.incidentName}
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
        Header: "Impacted System",
        Cell: (props) => {
          return (
            <div className="text-sm">
              {props.row.original.impactedSystem
                ? props.row.original.impactedSystem
                : "-"}
            </div>
          );
        },
      },
      {
        Header: "Assign",
        Cell: () => {
          return (
            <select name="" id="">
              <option value="Harits">Harits</option>
              <option value="Dimas">Dimas</option>
              <option value="Rizky">Rizky</option>
              <option value="Bima">Bima</option>
              <option value="Edo">Edo</option>
            </select>
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
      <Layout key="LayoutAssign" session={user}>
        <Head>
          <title>Need Assign List</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Need Assign List"></PageHeader>

          {/* Problem Tables table (small breakpoint and up) */}
          <div className="hidden sm:block mt-3">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <ProblemTables columns={columns} data={assign} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
