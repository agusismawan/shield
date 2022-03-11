import Head from "next/head";
import Layout from "../../components/layout";
import { useRef, useState } from "react";
import { SourcePill, StatusPill } from "components/problems/status-badge";
import { CardTitle } from "components/ui/card-title";
import { ButtonCircle } from "components/ui/button/button-circle";
import { CardContent } from "components/ui/card-content";
import {
  PencilIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";
import format from "date-fns/format";
import withSession from "lib/session";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProblemDetail({ user, problem }) {
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <Layout key="LayoutProblemDetail" session={user}>
        <Head>
          <title>{problem.data.problemNumber}</title>
        </Head>
        <section>
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-full lg:px-12">
              <div className="flex items-center space-x-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {problem.data.problemName}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    Created by&nbsp;
                    <a href="#" className="text-gray-900">
                      {problem.data.created_by.fullName
                        ? problem.data.created_by.fullName
                        : problem.data.created_by.userName}
                    </a>{" "}
                    on{" "}
                    <time
                      dateTime={format(
                        new Date(problem.data.createdAt),
                        "d LLLL yyyy hh:mm"
                      )}
                    >
                      {format(
                        new Date(problem.data.createdAt),
                        "d LLLL yyyy hh:mm"
                      )}
                    </time>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <span
                  className={classNames(
                    problem.data.problemStatus.label
                      .toLowerCase()
                      .startsWith("waiting")
                      ? "bg-gray-100 text-gray-800"
                      : problem.data.problemStatus.label
                          .toLowerCase()
                          .startsWith("unassigned")
                      ? "bg-red-100 text-gray-800"
                      : problem.data.problemStatus.label
                          .toLowerCase()
                          .startsWith("ongoing")
                      ? "bg-blue-100 text-gray-800"
                      : problem.data.problemStatus.label
                          .toLowerCase()
                          .startsWith("done")
                      ? "bg-green-100 text-gray-800"
                      : "bg-gray-100 text-gray-800",
                    "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-sm font-medium"
                  )}
                >
                  {problem.data.problemStatus.label}
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Problem Detail */}
                <section aria-labelledby="problem detail">
                  <div className="bg-white shadow sm:rounded-lg">
                    <CardTitle
                      title={`Problem Number ${problem.data.problemNumber}`}
                      subtitle={`wasweswos fafifu`}
                    >
                      <div className="px-4 flex">
                        {user.grant != "viewer" && (
                          <ButtonCircle
                            action={() => {
                              setEditMode(true);
                            }}
                            className="border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-50"
                          >
                            <PencilIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </ButtonCircle>
                        )}
                      </div>
                    </CardTitle>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Application
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.app.subname
                              ? problem.data.app.subname
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Link JIRA
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <a
                              href={
                                problem.data.jiraProblem
                                  ? problem.data.jiraProblem
                                  : "Not defined yet"
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {problem.data.jiraProblem
                                ? problem.data.jiraProblem
                                : "Not defined yet"}
                            </a>
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Impact
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.impact.impact
                              ? problem.data.impact.impact
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Urgency
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.urgency.urgency
                              ? problem.data.urgency.urgency
                              : "Not defined yet"}
                          </dd>
                        </div>

                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Source
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.problemSource.label ? (
                              <SourcePill
                                value={problem.data.problemSource.label}
                              />
                            ) : (
                              "Not defined yet"
                            )}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          {/* <dt className="text-sm font-medium text-gray-500">
                            Status
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.problemStatus.label ? (
                              <StatusPill
                                value={problem.data.problemStatus.label}
                              />
                            ) : (
                              "Not defined yet"
                            )}
                          </dd> */}
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="incident-detail">
                  <div className="bg-white shadow sm:rounded-lg">
                    <table className="min-w-full" role="table">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Number
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reported by
                          </th>
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reported at
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {problem.data.incidents.map((incident) => (
                          <>
                            <tr>
                              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.incidentNumber}
                              </td>
                              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.incidentName}
                              </td>
                              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.createdBy}
                              </td>
                              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                {incident.createdAt}
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <section
                aria-labelledby="timeline-title"
                className="lg:col-start-3 lg:col-span-1"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  {/* Incident Info */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">
                        Problem Type
                      </h2>
                      <ul className="mt-2 leading-8">
                        <li className="inline">
                          <a
                            href="#"
                            className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                          >
                            <div className="absolute flex-shrink-0 flex items-center justify-center">
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-rose-500"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3.5 text-sm font-medium text-gray-900">
                              {problem.data.priorityMatrix.mapping}
                            </div>
                          </a>{" "}
                        </li>
                        <li className="inline">
                          <a
                            href="#"
                            className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                          >
                            <div className="absolute flex-shrink-0 flex items-center justify-center">
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3.5 text-sm font-medium text-gray-900">
                              {problem.data.app.criticalityApp}
                            </div>
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                    <h2 className="text-sm font-medium text-gray-900">
                      Time Flying
                    </h2>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-rose-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Started on
                        <time
                          dateTime={format(
                            new Date(problem.data.createdAt),
                            "d LLLL yyyy hh:mm"
                          )}
                        >
                          {` ${format(
                            new Date(problem.data.createdAt),
                            "d LLLL yyyy hh:mm"
                          )}`}
                        </time>
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Resolved on{" "}
                        <time
                          dateTime={format(
                            new Date(problem.data.updatedAt),
                            "d LLLL yyyy hh:mm"
                          )}
                        >
                          {` ${format(
                            new Date(problem.data.updatedAt),
                            "d LLLL yyyy hh:mm"
                          )}`}
                        </time>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reporter */}
                <div className="bg-white shadow sm:rounded-lg mt-3">
                  <div className="space-y-4 px-4 py-5 sm:px-6">
                    <h2 className="text-sm font-medium text-gray-900">
                      Assigned To
                    </h2>
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon
                        className="h-6 w-6 text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600 text-sm">
                        {problem.data.assigned_to
                          ? problem.data.assigned_to.fullName
                          : "Undefined"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">
                        Last updated on{" "}
                        {problem.data.updatedAt
                          ? format(
                              new Date(problem.data.updatedAt),
                              "dd MMM yyyy HH:mm",
                              "id-ID"
                            )
                          : format(
                              new Date(problem.data.createdAt),
                              "dd MMM yyyy HH:mm",
                              "id-ID"
                            )}{" "}
                        <br />
                        by{" "}
                        {problem.data.updated_by
                          ? problem.data.updated_by.fullName
                          : problem.data.updated_by.fullName}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default ProblemDetail;

export const getServerSideProps = withSession(async function ({ req, params }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const res = await fetch(
    `http://127.0.0.1:3030/v1/probman/problem/${params.id}`
  );
  const data = await res.json();
  return {
    props: {
      user: user,
      problem: data,
    },
  };
});
