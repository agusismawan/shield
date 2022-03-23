import Link from "next/link";
import Head from "next/head";
import Layout from "../../components/layout";
import PageHeader from "../../components/problems/page-header";
import CardHeader from "../../components/problems/card-header";
import ProblemTables from "components/problems/problem-tables";
import { EyeIcon } from "@heroicons/react/solid";
import { useEffect, useState, useMemo, useRef } from "react";
import format from "date-fns/format";
import {
  PriorityArrow,
  SourcePill,
  StatusPill,
} from "../../components/problems/status-badge";
import axios from "axios";
import { useAsyncDebounce } from "react-table";
import withSession from "../../lib/session";
import {
  PlusSmIcon,
  SearchIcon,
  DocumentAddIcon,
  PuzzleIcon,
  SparklesIcon,
  BadgeCheckIcon,
  AtSymbolIcon,
  BanIcon,
} from "@heroicons/react/outline";
import AsyncSelect from "react-select/async";
import { ReactSelect } from "components/ui/forms";
import { styledReactSelectAdd } from "components/utils";
import { PrimaryAnchorButton } from "components/ui/button/primary-anchor-button";
import { SecondaryAnchorButton } from "components/ui/button/secondary-anchor-button";
import { Input } from "antd";

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

  const resAllJoin = await fetch(
    "http://127.0.0.1:3030/v1/probman/problem/alljoin"
  );
  const problems = await resAllJoin.json();

  if (resAllJoin.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: user,
        problems: problems.data,
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

export default function ProblemList({ user, problems }) {
  const [tableData, setTableData] = useState([]);
  const [apps, setApps] = useState("");
  const [value, setValue] = useState(""); // tableInstance.current.state.globalFilter
  const tableInstance = useRef(null);
  const count = problems.length;
  const handleGlobalChange = useAsyncDebounce((value) => {
    tableInstance.current.setGlobalFilter(value || undefined);
  }, 1000);

  const SourceProblemOptions = [
    { value: "IM", label: "IM" },
    { value: "Insiden Berulang", label: "Insiden Berulang" },
    { value: "HC", label: "HC" },
    { value: "PROACTIVE", label: "PROACTIVE" },
    { value: "DEEP", label: "DEEP" },
  ];

  const ProblemStatusOptions = [
    { value: "Unassigned", label: "Unassigned" },
    { value: "Draft", label: "Draft" },
    { value: "Rejected", label: "Rejected" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Investigate", label: "Investigate" },
    { value: "Priority Queue", label: "Priority Queue" },
    { value: "Approval RCA", label: "Approval RCA" },
    { value: "Ongoing Resolution", label: "Ongoing Resolution" },
    { value: "Request Re-Investigate", label: "Request Re-Investigate" },
    { value: "KEDB Evaluation", label: "KEDB Evaluation" },
    { value: "Approval KEDB", label: "Approval KEDB" },
    { value: "Problem Solved", label: "Problem Solved" },
  ];

  // Get Data Aplikasi Async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API_URL}/parameters/app?subName=${value}`
        )
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: d.subName,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  const handleAppChange = (event) => {
    if (event == null) {
      setApps("");
    } else {
      setApps(event.value);
    }
  };

  const handleSourceProblemChange = (event) => {
    if (event == null) {
      setSourceProblem("");
    } else {
      setSourceProblem(event.value);
    }
  };

  const handleProblemStatusChange = (event) => {
    if (event == null) {
      setProblemStatus("");
    } else {
      setProblemStatus(event.value);
    }
  };

  useEffect(() => {
    // gatau mesti gimana
    // ini harus nya nge get filter
  });

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
                <SourcePill value={props.row.original.problemSource.label} />
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
                  {props.row.original.incidents.length == 0
                    ? "Problem Non Incident"
                    : props.row.original.multipleIncident == "N"
                    ? props.row.original.incidents.map((incident) => {
                        return incident.incidentNumber;
                      })
                    : "Multiple Incident"}
                </text>
                {` | ${props.row.original.problemNumber}`}
              </div>
              <div className="text-base text-gray-900">
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
        // Filter: balbalblabla,
        // filter: 'includes',
        Cell: (props) => {
          return (
            <div>
              <StatusPill value={props.row.original.problemStatus.label} />
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
                    Not Assigned
                    <BanIcon className="pl-1 h-5 w-5" aria-hidden="true" />
                  </div>
                </>
              )}
            </div>
          );
        },
      },
      {
        Header: "Latest Progress",
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
          <title>All Problem List</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Problem List">
            <Link href="/problem/create" passHref>
              <PrimaryAnchorButton>
                <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Problem
              </PrimaryAnchorButton>
            </Link>
            {user.username === "haritsf" ? (
              <Link href="/problem/assign" passHref>
                <SecondaryAnchorButton>
                  <AtSymbolIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Need Assign
                </SecondaryAnchorButton>
              </Link>
            ) : (
              ""
            )}
          </PageHeader>

          {/* Cards */}
          <div className="px-4 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
              <CardHeader
                id="1"
                bgColor="bg-gray-500"
                initials={<DocumentAddIcon className="w-6 h-6" />}
                title="Draft and Unassigned"
                desc={`${
                  problems.filter(
                    (data) => data.problemStatus.label === "Draft"
                  ).length
                } Draft | ${
                  problems.filter(
                    (data) => data.problemStatus.label === "Unassigned"
                  ).length
                } Unassigned`}
              />
              <CardHeader
                id="2"
                bgColor="bg-yellow-500"
                // style={{backgroundColor: 'green'}}
                initials={<PuzzleIcon className="w-6 h-6" />}
                title="Review"
                desc={`${
                  problems.filter(
                    (data) => data.problemStatus.label === "Waiting for Review"
                  ).length
                } Waiting for Review`}
              />
              <CardHeader
                id="3"
                bgColor="bg-blue-500"
                initials={<SparklesIcon className="w-6 h-6" />}
                title="Ongoing"
                desc={`${
                  problems.filter(
                    (data) => data.problemStatus.label === "Ongoing at JIRA"
                  ).length
                } Ongoing at JIRA`}
              />
              <CardHeader
                id="4"
                bgColor="bg-green-500"
                initials={<BadgeCheckIcon className="w-6 h-6" />}
                title="Done"
                desc={`${
                  problems.filter(
                    (data) => data.problemStatus.label === "Need Acknowledged"
                  ).length
                } Acknowledged | ${
                  problems.filter((data) => data.problemStatus.label === "Done")
                    .length
                } Resolved`}
              />
            </ul>
          </div>

          {/* Problem Tables table (small breakpoint and up) */}
          <div className="hidden sm:block mt-3">
            <div className="align-middle px-4 pb-4 sm:px-6 lg:px-8 border-b border-gray-200">
              <div className="flex gap-x-2">
                {/* Search Component */}
                <div className="flex-auto">
                  <label
                    htmlFor="search"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Search
                  </label>
                  <Input
                    disabled={true}
                    allowClear
                    value={value || ""}
                    onChange={(e) => {
                      setValue(e.target.value);
                      handleGlobalChange(e.target.value);
                    }}
                    placeholder={`${count} records...`}
                    prefix={
                      <SearchIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    }
                    style={{
                      borderRadius: "0.375rem",
                      height: "38px",
                    }}
                  />
                </div>

                {/* Application Filter */}
                <div>
                  <label
                    htmlFor="application"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Application
                  </label>
                  <AsyncSelect
                    isClearable
                    loadOptions={loadApplications}
                    styles={styledReactSelectAdd}
                    className="text-sm focus:ring-blue-300 focus:border-blue-300 w-80"
                    placeholder="Search App"
                    onChange={handleAppChange}
                  />
                </div>

                {/* Source Problem Filter */}
                <div className="flex-intitial">
                  <label
                    htmlFor="SourceProblemOptions"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Source Problem
                  </label>
                  <ReactSelect
                    isDisabled={true}
                    options={SourceProblemOptions}
                    isClearable
                    className="block w-60"
                    onChange={handleSourceProblemChange}
                  />
                </div>

                {/* Problem Status Filter */}
                <div>
                  <label
                    htmlFor="ProblemStatus"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    Status Problem
                  </label>
                  <ReactSelect
                    isDisabled={true}
                    options={ProblemStatusOptions}
                    isClearable
                    className="block w-60"
                    onChange={handleProblemStatusChange}
                  />
                </div>
              </div>

              <ProblemTables columns={columns} data={problems} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
