import Layout from "../../components/layout";
import Head from "next/head";
import format from "date-fns/format";
import axios from "axios";
import Select from "react-select";
import withSession from "../../lib/session";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CardTitle } from "../../components/ui/card-title";
import { CardContent } from "../../components/ui/card-content";
import { ButtonCircle } from "../../components/ui/button-circle";
import { classNames, styledReactSelect } from "../../components/utils";
import {
  PencilIcon,
  XIcon,
  CheckIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";

const people = [
  {
    name: "Jane Cooper",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.cooper@example.com",
  },
  {
    name: "Jane Marry",
    title: "Regional Paradigm Technician",
    role: "Admin",
    email: "jane.marry@example.com",
  },
];

export const getServerSideProps = withSession(async function ({
  req,
  res,
  params,
}) {
  const user = req.session.get("user");

  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  // Fetch data from external API
  const [incidentRes, typeRes, urgencyRes, impactRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/incidents/${params.id}`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/parameters/urgency?isActive=Y`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/parameters/impact?isActive=Y`),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/parameters/incidenttype`),
  ]);
  const [incident, urgency, impact, type] = await Promise.all([
    incidentRes.json(),
    typeRes.json(),
    urgencyRes.json(),
    impactRes.json(),
  ]);
  // Pass data to the page via props
  return {
    props: {
      user: req.session.get("user"),
      incident,
      type,
      urgency,
      impact,
    },
  };
});

function IncidentDetail({ incident, type, urgency, impact }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const typeList = [];
  type.data.map((item) =>
    typeList.push({
      label: item.incidentType,
      value: item.id,
    })
  );

  const urgencyList = [];
  urgency.data.map((item) =>
    urgencyList.push({
      label: item.urgency,
      value: item.id,
    })
  );

  const impactList = [];
  impact.data.map((item) =>
    impactList.push({
      label: item.impact,
      value: item.id,
    })
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      idIncidentType: incident.data.paramIncidentType
        ? {
            label: incident.data.paramIncidentType.incidentType,
            value: incident.data.paramIncidentType.id,
          }
        : {
            label: "Select incident type...",
            value: null,
          },
      idUrgency: incident.data.paramUrgency
        ? {
            label: incident.data.paramUrgency.urgency,
            value: incident.data.paramUrgency.id,
          }
        : {
            label: "Select urgency...",
            value: null,
          },
      idImpact: incident.data.paramImpact
        ? {
            label: incident.data.paramImpact.impact,
            value: incident.data.paramImpact.id,
          }
        : {
            label: "Select impact...",
            value: null,
          },
    },
  });

  const onSubmit = async (data) => {
    console.log(data);
    data = Object.assign(data, {
      idIncidentType: data.idIncidentType.value,
      idUrgency: data.idUrgency.value,
      idImpact: data.idImpact.value,
    });
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}`,
        data
      )
      .then(function (response) {
        if (response.status === 200) {
          toast.success("Incident updated.");
          router.reload();
        } else {
          toast.error(`Failed to update ${response.status}`);
        }
      })
      .catch(function (error) {
        toast.error(error);
      });
  };
  console.log(errors);

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
                    "sm:ml-3 inline-flex items-center justify-center px-3 py-0.5 rounded-md text-sm font-medium"
                  )}
                >
                  {incident.data.incidentStatus}
                </span>
              </div>
            </div>

            <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Incident Detail */}
                {editMode ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <section aria-labelledby="incident-detail">
                      <div className="bg-white shadow sm:rounded-lg">
                        <CardTitle
                          title={`Incident Report ${incident.data.incidentNumber}`}
                          subtitle={`Priority ${
                            incident.data.paramPriorityMatrix
                              ? incident.data.paramPriorityMatrix.mapping
                              : "Not defined yet"
                          }, ${
                            incident.data.resolvedIntervals
                              ? `Duration ${incident.data.resolvedIntervals} minutes`
                              : `Started ${format(
                                  new Date(incident.data.startTime),
                                  "dd MMM yyyy HH:mm",
                                  "id-ID"
                                )}`
                          }`}
                        >
                          <div className="px-4 flex">
                            <ButtonCircle
                              action={() => {
                                setEditMode(false);
                                reset();
                              }}
                              className="border-transparent text-white bg-rose-600 hover:bg-rose-700"
                            >
                              <XIcon className="h-5 w-5" aria-hidden="true" />
                            </ButtonCircle>
                            <ButtonCircle
                              action={handleSubmit(onSubmit)}
                              className="ml-3 border-transparent text-white bg-blue-600 hover:bg-blue-700"
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </ButtonCircle>
                          </div>
                        </CardTitle>
                        <CardContent>
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
                            <label
                              htmlFor="incident-type"
                              className="block text-sm font-medium text-gray-500"
                            >
                              Incident Type
                            </label>
                            <Controller
                              name="idIncidentType"
                              control={control}
                              rules={{ required: "This is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className="block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  options={typeList}
                                  styles={styledReactSelect}
                                />
                              )}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="urgency"
                              className="block text-sm font-medium text-gray-500"
                            >
                              Urgency
                            </label>
                            <Controller
                              name="idUrgency"
                              control={control}
                              rules={{ required: "This is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className="block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  options={urgencyList}
                                  styles={styledReactSelect}
                                />
                              )}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="impact"
                              className="block text-sm font-medium text-gray-500"
                            >
                              Impact
                            </label>
                            <Controller
                              name="idImpact"
                              control={control}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  className="block w-full pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                  options={impactList}
                                  styles={styledReactSelect}
                                />
                              )}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Impacted System
                            </dt>
                            <textarea
                              id="impact-system"
                              {...register("impactedSystem", {
                                required: "This is required!",
                              })}
                              rows={4}
                              className={classNames(
                                errors.impactedSystem
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              defaultValue={
                                incident.data.impactedSystem
                                  ? incident.data.impactedSystem
                                  : ""
                              }
                            />
                            {errors.impactedSystem && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.impactedSystem.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Root Cause
                            </dt>
                            <textarea
                              id="root-cause"
                              {...register("rootCause", {
                                required: "This is required!",
                              })}
                              rows={4}
                              className={classNames(
                                errors.rootCause
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              defaultValue={
                                incident.data.rootCause
                                  ? incident.data.rootCause
                                  : ""
                              }
                            />
                            {errors.rootCause && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.rootCause.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">
                              Action Items
                            </dt>
                            <textarea
                              id="action-items"
                              {...register("actionItem", {
                                required: "This is required!",
                              })}
                              rows={4}
                              className={classNames(
                                errors.rootCause
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              defaultValue={
                                incident.data.actionItem
                                  ? incident.data.actionItem
                                  : ""
                              }
                            />
                            {errors.actionItem && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.actionItem.message}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </section>
                  </form>
                ) : (
                  <section aria-labelledby="incident-detail">
                    <div className="bg-white shadow sm:rounded-lg">
                      <CardTitle
                        title={`Incident Report ${incident.data.incidentNumber}`}
                        subtitle={
                          incident.data.resolvedIntervals
                            ? `Duration ${incident.data.resolvedIntervals} minutes`
                            : `Started ${format(
                                new Date(incident.data.startTime),
                                "dd MMM yyyy HH:mm",
                                "id-ID"
                              )}`
                        }
                      >
                        <div className="px-4 flex">
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
                        </div>
                      </CardTitle>
                      <CardContent>
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
                            Impacted System
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
                      </CardContent>
                    </div>
                  </section>
                )}
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
                              {incident.data.paramIncidentType
                                ? incident.data.paramIncidentType.incidentType
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
                                className="h-1.5 w-1.5 rounded-full bg-blue-500"
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
                        Started on{" "}
                        {format(
                          new Date(incident.data.startTime),
                          "dd MMM yyyy HH:mm",
                          "id-ID"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Resolved on{" "}
                        {format(
                          new Date(incident.data.endTime),
                          "dd MMM yyyy HH:mm",
                          "id-ID"
                        )}
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
                        Last updated on{" "}
                        {format(
                          new Date(incident.data.endTime),
                          "dd MMM yyyy HH:mm",
                          "id-ID"
                        )}{" "}
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
