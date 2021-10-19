import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import {
  DocumentTextIcon,
  CalendarIcon,
  UserCircleIcon,
  CashIcon,
  ChevronRightIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(date) {
  const setFormat = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
    timeZoneName: "short",
  });

  return setFormat.format(new Date(date));
}

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
];

function IncidentDetail({ incident }) {
  return (
    <>
      <Layout>
        <Head>
          <title>Incident Report</title>
        </Head>
        <section>
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-full lg:px-12">
              {/* Page header, contain incident title */}
              <div className="flex items-center space-x-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {incident.data.incidentName}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    Reported by{" "}
                    <a href="#" className="text-gray-900">
                      Lord Commander
                    </a>{" "}
                    on <time dateTime="2020-08-25">August 25, 2020</time>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <span
                  className={classNames(
                    incident.data.incidentStatus == "Open"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800",
                    "inline-flex items-center justify-center px-3 py-0.5 rounded-md text-sm font-medium"
                  )}
                >
                  {incident.data.incidentStatus}
                </span>
                <span className="sm:ml-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <DocumentTextIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Edit Postmortem
                  </button>
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Incident Detail */}
                <section aria-labelledby="applicant-information-title">
                  <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h2
                        id="applicant-information-title"
                        className="text-lg leading-6 font-medium text-gray-900"
                      >
                        Incident Report {incident.data.incidentNumber}
                      </h2>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {incident.data.resolvedIntervals
                          ? `Duration ${incident.data.resolvedIntervals} minutes`
                          : `Started ${formatDate(incident.data.startTime)}`}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Application
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.paramApps.name
                              ? incident.data.paramApps.name
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Incident Priority
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.paramPriorityMatrix
                              ? incident.data.paramPriorityMatrix.mapping
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Urgency
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.paramUrgency
                              ? incident.data.paramUrgency.urgency
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Impact
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.paramImpact
                              ? incident.data.paramImpact.impact
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Impacted Service
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.impactedSystem
                              ? incident.data.impactedSystem
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Root Cause
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.rootCause
                              ? incident.data.rootCause
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Action Items
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {incident.data.actionItem
                              ? incident.data.actionItem
                              : "Not defined yet"}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </section>

                <section aria-labelledby="notes-title">
                  <div className="flex flex-col">
                    <div className="mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                              Timeline
                            </h3>
                          </div>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Time
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Activity
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {people.map((person) => (
                                <tr key={person.email}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {person.name}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {person.title}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section
                aria-labelledby="incident-info"
                className="lg:col-start-3 lg:col-span-1"
              >
                <div className="bg-white shadow sm:rounded-lg">
                  {/* Incident Info */}
                  <div className="space-y-4 px-4 py-5 sm:px-6">
                    <div>
                      <h2 className="text-sm font-medium text-gray-500">
                        Incident Type
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
                              {incident.data.incidentType
                                ? incident.data.incidentType
                                : "-"}
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
                              Critical Sev 1
                            </div>
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-rose-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Started on {formatDate(incident.data.startTime)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Resolved on {formatDate(incident.data.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 space-y-4 px-4 py-5 sm:px-6">
                    <h2 className="text-sm font-medium text-gray-500">
                      Reporter
                    </h2>
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon
                        className="h-5 w-5 text-gray-700"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Lord Commander
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900 text-sm">
                        Last updated on {formatDate(incident.data.endTime)}{" "}
                        <br />
                        by Jon Snow
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

export default IncidentDetail;

export async function getServerSideProps(context) {
  // Fetch data from external API
  const res = await fetch(
    `https://ularkadut.xyz/v1.0/incidents/${context.params.id}`
  );
  const data = await res.json();

  // Pass data to the page via props
  return {
    props: {
      incident: data,
    },
  };
}
