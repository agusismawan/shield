import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import AvatarCell from "../../components/incidents/avatar-cell";
import PageHeader from "../../components/incidents/page-header";
import Table from "../../components/incidents/table";
import SelectColumnFilter from "../../components/incidents/dropdown-filter";
import axios from "axios";
import withSession from "../../lib/session";
import format from "date-fns/format";
import { useMemo } from "react";
import { StatusPill, StatusText } from "../../components/incidents/status-pill";
import { PlusSmIcon } from "@heroicons/react/outline";
import { ButtonSmall } from "../../components/ui/button";
import { classNames } from "../../components/utils";

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

  res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.data;

  return {
    props: {
      user: req.session.get("user"),
      data: data.data,
    },
  };
});

function IncidentList({ user, data }) {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: (row) => {
          return <div>{Number(row.row.id) + 1}</div>;
        },
      },
      {
        Header: "Incident Name",
        accessor: "incidentName",
        Cell: (props) => {
          return (
            <div>
              <div>
                <Link
                  href={`/incidents/${props.row.original.id}`}
                  className="group inline-flex space-x-2 truncate text-sm"
                >
                  <a className="text-gray-500 truncate group-hover:text-gray-900">
                    {props.value}
                  </a>
                </Link>
              </div>
              <div>
                <span
                  className={classNames(
                    "inline-flex items-center px-1.5 py-px rounded text-xs font-medium",
                    props.row.original.incidentStatus === "Open"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  )}
                >
                  {props.row.original.incidentStatus}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        Header: "Application",
        accessor: "paramApps.name",
        Filter: SelectColumnFilter,
        // filter: 'includes',
        Cell: StatusText,
      },
      {
        Header: "Priority",
        accessor: "paramPriorityMatrix.mapping",
        Cell: StatusPill,
      },
      {
        Header: "Duration",
        accessor: "resolvedIntervals",
        Cell: (props) =>
          props.row.original.resolvedIntervals
            ? props.row.original.resolvedIntervals
            : "-",
      },
      {
        Header: "Started At",
        accessor: "startTime",
        Cell: (props) => {
          return (
            <div>
              <div className="text-xs font-normal text-gray-900">
                {format(
                  new Date(props.row.original.startTime),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </div>
              <div className="text-xs font-normal text-gray-500">
                End at{" "}
                {format(
                  new Date(props.row.original.endTime),
                  "dd/MM/yyyy HH:mm:ss"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Reporter",
        accessor: "",
        Cell: AvatarCell,
      },
    ],
    []
  );

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Incident Report</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Incident Report">
            <Link href="/incidents/add" passHref>
              <ButtonSmall type="button">
                <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Incident
              </ButtonSmall>
            </Link>
          </PageHeader>
          <div className="hidden sm:block mt-3">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
              <Table columns={columns} data={data} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default IncidentList;
