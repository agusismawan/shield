import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import AvatarCell from "../../components/incidents/avatar-cell";
import PageHeader from "../../components/incidents/page-header";
import Table from "../../components/incidents/table";
import {
  SelectColumnFilter,
  StatusFilter,
} from "../../components/incidents/dropdown-filter";
// import DateRangeFilter from "../../components/incidents/daterange-filter";
import axios from "axios";
import withSession from "../../lib/session";
import format from "date-fns/format";
import { useMemo } from "react";
import {
  StatusPill,
  StatusText,
  StatusIncident,
} from "../../components/incidents/status-pill";
import { PlusSmIcon } from "@heroicons/react/outline";
import { ButtonSmall } from "../../components/ui/button";

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
      // {
      //   Header: "#",
      //   Cell: (row) => {
      //     return <div>{Number(row.row.id) + 1}</div>;
      //   },
      // },
      {
        Header: "Incident Name",
        accessor: "incidentName",
        Cell: (props) => {
          return (
            <div>
              <Link href={`/incidents/${props.row.original.id}`}>
                <a className="text-blue-500 hover:text-blue-900">
                  {props.value}
                </a>
              </Link>
              <p className="mt-1 flex items-center text-xs text-gray-500">
                {props.row.original.incidentNumber
                  ? `#${props.row.original.incidentNumber}`
                  : ""}
              </p>
            </div>
          );
        },
      },
      {
        Header: "Application",
        accessor: "paramApps.subName",
        Filter: SelectColumnFilter,
        filter: "includes",
        Cell: StatusText,
      },
      {
        Header: "Priority",
        accessor: "paramPriorityMatrix.mapping",
        Cell: StatusPill,
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "incidentStatus",
        Cell: StatusIncident,
        Filter: StatusFilter,
        filter: "includes",
        disableSortBy: true,
      },
      {
        Header: "Start Time",
        accessor: "logStartTime",
        // Filter: DateRangeFilter,
        Cell: (props) => {
          return (
            <div>
              <div className="text-xs text-gray-900">
                {format(
                  new Date(props.row.original.logStartTime),
                  "dd MMM yyyy HH:mm"
                )}
              </div>
              <div className="text-xs text-gray-500">
                {props.row.original.resolvedIntervals ? (
                  <span className="text-xs">
                    {props.row.original.resolvedIntervals} minutes
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Reporter",
        accessor: "paramCreatedBy.fullname",
        Cell: AvatarCell,
        disableSortBy: true,
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
