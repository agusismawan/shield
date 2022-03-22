import Head from "next/head";
import Layout from "../../../components/layout";
import PageHeader from "../../../components/problems/page-header";
import ProblemTables from "components/problems/problem-tables";
import { EyeIcon } from "@heroicons/react/solid";
import { useEffect, useState, useMemo, useRef } from "react";
import format from "date-fns/format";
import {
  PriorityArrow,
  SourcePill,
} from "../../../components/problems/status-badge";
import { StatusIncident } from "components/problems/status-badge";
import withSession from "../../../lib/session";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { styledReactSelect } from "components/utils";

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
    return {
      props: {
        user: user,
        assign: getAssign.data,
      },
    };
  } else {
    return {
      props: {
        user: user,
        assign: null,
      },
    };
  }
});

export default function AssignList({ user, assign }) {
  const { handleSubmit, control, formState } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  // const hitUpdateAssign = async (data, event, props) => {
  //   event.preventDefault();
  //   Object.assign(data, {
  //     assignedTo: event.target.idAssign,
  //     updatedBy: 62, // Hardcode ke Pemberi Assign
  //   });
  //   axios
  //     .put(
  //       `http://127.0.0.1:3030/v1/probman/incident/recprob/${props.row.original.problem.id}`,
  //       data,
  //       {
  //         headers: { Authorization: `Bearer ${user.accessToken}` },
  //       }
  //     )
  //     // .then(function (response) {
  //     //   if (response.status === 201 || postProblem) {
  //     //     toast.success("Problem Sucessfully Created");
  //     //     router.push("/problem");
  //     //   }
  //     // })
  //     .catch((error) => {
  //       if (error.response) {
  //         toast.error(
  //           `${error.response.data.message} (Code: ${error.response.status})`
  //         );
  //       } else if (error.request) {
  //         toast.error(`Request: ${error.request}`);
  //       } else {
  //         toast.error(`Message: ${error.message}`);
  //       }
  //     });
  // };

  const tableInstance = useRef(null);

  const [assignOptions, setAssignOptions] = useState([]);
  const { errors, isSubmitting } = formState;

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
              <div style={{ textAlign: "-webkit-center" }} className="w-100">
                <PriorityArrow
                  value={props.row.original.priorityMatrix.mapping}
                />
                <SourcePill
                  value={props.row.original.problem.problemSource.label}
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
        Header: "Status",
        Cell: (props) => {
          return (
            <div>
              {props.row.original.incidentStatus ? (
                <StatusIncident value={props.row.original.incidentStatus} />
              ) : (
                "-"
              )}
            </div>
          );
        },
      },
      {
        Header: "Application",
        Cell: (props) => {
          return (
            <div className="text-base text-gray-900">
              {props.row.original.app.subname}
            </div>
          );
        },
      },
      {
        Header: "Detail",
        Cell: (props) => {
          return (
            <>
              {/* <form onSubmit={handleSubmit(hitUpdateAssign)}> */}
              <div style={{ textAlign: "-webkit-center" }}>
                <a
                  href={`/problem/${props.row.original.problem.id}`}
                  className="bg-gray-100 text-gray-900"
                >
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </div>
              {/* </form> */}
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
              {assign ? (
                <ProblemTables columns={columns} data={assign} />
              ) : (
                "No Need to be Assign"
                // <ProblemTables columns={columns} data={false} />
              )}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
