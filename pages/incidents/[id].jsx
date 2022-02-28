import Layout from "components/layout";
import Head from "next/head";
import axios from "axios";
import Select from "react-select";
import DatePicker from "components/ui/datepicker";
import withSession from "lib/session";
import incidentStatus from "public/incident-status.json";
import { format, parseISO } from "date-fns";
import { useRouter } from "next/router";
import { Fragment, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CardTitle } from "components/ui/card-title";
import { CardContent } from "components/ui/card-content";
import { ButtonCircle } from "components/ui/button/button-circle";
import { classNames, styledReactSelect } from "components/utils";
import { Spinner } from "components/ui/spinner";
import { Listbox, Transition, Switch } from "@headlessui/react";
import {
  PencilIcon,
  XIcon,
  CheckIcon,
  ChevronDownIcon,
  ExclamationCircleIcon,
  RefreshIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";

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

  // get data incident detail
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/incidents/${params.id}`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  const data = await res.json();

  if (res.status === 200) {
    // Pass data to the page via props
    return {
      props: {
        user: req.session.get("user"),
        incident: data,
      },
    };
  } else if (res.status === 401) {
    if (data.code === 999) {
      return {
        redirect: {
          destination: "/auth",
          permanent: false,
        },
      };
    } else if (data.code === 401) {
      return {
        notFound: true,
      };
    }
  } else if (res.status === 404) {
    return {
      notFound: true,
    };
  }
});

function IncidentDetail({ user, incident }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // get data incident type
  const [incidentTypeOptions, setIncidentTypeOptions] = useState([]);
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_URL}/parameters/incidenttype?isActive=Y`,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.incidentType,
        }));
        setIncidentTypeOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get incident type list: ${error.response.data.message}`
        )
      );
  }, []);

  // get data urgency list
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/urgency?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.urgency,
        }));
        setUrgencyOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get urgency list: ${error.response.data.message}`
        )
      );
  }, []);

  // get data impact list
  const [impactOptions, setImpactOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/impact?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.impact,
        }));
        setImpactOptions(data);
      })
      .catch((error) =>
        toast.error(`Unable to get impact list: ${error.response.data.message}`)
      );
  }, []);

  // get data enhancement list
  const [enhanceOptions, setEnhanceOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/problemtype?isActive=Y`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((response) => {
        const data = response.data.data.map((item) => ({
          value: item.id,
          label: item.problemType,
        }));
        setEnhanceOptions(data);
      })
      .catch((error) =>
        toast.error(
          `Unable to get enhancement list: ${error.response.data.message}`
        )
      );
  }, []);

  const {
    register,
    unregister,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      idIncidentType: incident.data.paramIncidentType
        ? {
            label: incident.data.paramIncidentType.incidentType,
            value: incident.data.paramIncidentType.id,
          }
        : false,
      idUrgency: incident.data.paramUrgency
        ? {
            label: incident.data.paramUrgency.urgency,
            value: incident.data.paramUrgency.id,
          }
        : false,
      idImpact: incident.data.paramImpact
        ? {
            label: incident.data.paramImpact.impact,
            value: incident.data.paramImpact.id,
          }
        : false,
      logStartTime: incident.data.logStartTime
        ? parseISO(incident.data.logStartTime, new Date())
        : false,
      startTime: incident.data.startTime
        ? parseISO(incident.data.startTime, new Date())
        : false,
      endTime: incident.data.endTime
        ? parseISO(incident.data.endTime, new Date())
        : false,
      idProblemType: incident.data.idProblemType ? {
        label: incident.data.paramProblemType.problemType,
        value: incident.data.paramProblemType.id,
      } : false,
    },
  });

  // handle change on incident status dropdown
  const [selectedStatus, setSelectedStatus] = useState(
    incident.data.incidentStatus
  );
  const onStatusChange = (value) => {
    setSpinner(true);
    axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}`,
        { incidentStatus: value },
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(function (response) {
        setSpinner(false);
        if (response.status === 200) {
          setSelectedStatus(response.data.data.incidentStatus);
          toast.success(`Incident set to ${response.data.data.incidentStatus}`);
        } else {
          toast.error(`Failed to update: ${response.data.message}`);
        }
      })
      .catch(function (error) {
        // Error 😨
        setSpinner(false);
        toast.error(`${error.response.data.message}`);
      });
  };

  // Handle validate datetime
  const st = new Date(getValues("startTime"));
  const et = new Date(getValues("endTime"));
  const ls = new Date(getValues("logStartTime"));

  const handleDatetime = () => {
    return (
      st.setSeconds(0, 0) < et.setSeconds(0, 0) &&
      ls.setSeconds(0, 0) < et.setSeconds(0, 0)
    );
  };

  // Handle validate start time
  const handleStartTime = () => ls.setSeconds(0, 0) <= st.setSeconds(0, 0);

  // Handle switch button for permanent fix option
  const [enhancement, setEnhancement] = useState(
    incident.data.isProblem !== 'N' ? true : false
  );

  const handleSwitch = () => {
    if (enhancement) {
      unregister(["idProblemType", "proposedEnhancement"]);
      setValue("proposedEnhancement", null);
      setEnhancement(false);
    } else {
      setEnhancement(true);
    }
  };

  // handle form submit
  const onSubmit = async (data) => {
    data = Object.assign(data, {
      idIncidentType: data.idIncidentType.value,
      startTime: format(new Date(data.startTime), "yyyy-MM-dd HH:mm"),
      logStartTime: format(new Date(data.logStartTime), "yyyy-MM-dd HH:mm"),
      endTime: format(new Date(data.endTime), "yyyy-MM-dd HH:mm"),
      idUrgency: data.idUrgency.value,
      idImpact: data.idImpact.value,
      isProblem: enhancement === true ? 'W' : 'N',
      idProblemType: enhancement === true ? (data.idProblemType ? data.idProblemType.value : null) : null,
    });

    await axios
      .patch(
        `${process.env.NEXT_PUBLIC_API_URL}/incidents/${incident.data.id}`,
        data,
        {
          headers: { Authorization: `Bearer ${user.accessToken}` },
        }
      )
      .then(function (response) {
        !isSubmitting;
        if (response.status === 200) {
          toast.success("Incident updated");
          setTimeout(() => router.reload(), 500);
        } else {
          toast.error(`Failed to update: ${response.data.message}`);
        }
      })
      .catch(function (error) {
        // Error 😨
        toast.error(`Failed to update: ${error.response.data.message}`);
      });

    console.log(data);
  };

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>
            {incident.data.incidentNumber}{" "}
            {incident.data.paramApps ? incident.data.paramApps.subName : ""} -
            Shield
          </title>
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
                      {incident.data.paramCreatedBy
                        ? incident.data.paramCreatedBy.fullname
                        : "undefined"}
                    </a>{" "}
                    on{" "}
                    <time>
                      {format(
                        new Date(incident.data.createdAt),
                        "dd MMMM yyyy HH:mm",
                        "id-ID"
                      )}
                    </time>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <Listbox
                  value={selectedStatus}
                  onChange={(value) => {
                    onStatusChange(value);
                  }}
                  disabled={user.grant === "viewer" ? true : false}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">
                        Change incident status
                      </Listbox.Label>
                      <div className="relative">
                        <div className="inline-flex shadow-sm rounded-md divide-x divide-gray-200">
                          <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-200">
                            <div
                              className={classNames(
                                selectedStatus == "Open"
                                  ? "bg-red-500"
                                  : "bg-green-500",
                                "relative inline-flex items-center py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white"
                              )}
                            >
                              {spinner && <Spinner />}
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                              <p className="ml-2.5 text-sm font-medium">
                                {selectedStatus}
                              </p>
                            </div>
                            <Listbox.Button
                              className={classNames(
                                selectedStatus == "Open"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-green-500 hover:bg-green-600",
                                "relative inline-flex items-center p-2 rounded-l-none rounded-r-md text-sm font-medium text-white focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
                              )}
                            >
                              <span className="sr-only">
                                Change incident status
                              </span>
                              <ChevronDownIcon
                                className="h-5 w-5 text-white"
                                aria-hidden="true"
                              />
                            </Listbox.Button>
                          </div>
                        </div>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options
                            static
                            className="origin-top-right absolute z-10 right-0 mt-2 w-72 rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {incidentStatus.map((option) => (
                              <Listbox.Option
                                key={option.status}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "text-white bg-blue-500"
                                      : "text-gray-900",
                                    "cursor-default select-none relative p-4 text-sm"
                                  )
                                }
                                value={option.status}
                              >
                                {({ selected, active }) => (
                                  <div className="flex flex-col">
                                    <div className="flex justify-between">
                                      <p
                                        className={
                                          selected
                                            ? "font-semibold"
                                            : "font-normal"
                                        }
                                      >
                                        {option.status}
                                      </p>
                                      {selected ? (
                                        <span
                                          className={
                                            active
                                              ? "text-white"
                                              : "text-blue-500"
                                          }
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      ) : null}
                                    </div>
                                    <p
                                      className={classNames(
                                        active
                                          ? "text-blue-200"
                                          : "text-gray-500",
                                        "mt-2"
                                      )}
                                    >
                                      {option.description}
                                    </p>
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div>

            <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-8 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-2">
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
                              : "not defined yet"
                          }, ${
                            incident.data.resolvedIntervals
                              ? `duration ${incident.data.resolvedIntervals} minutes`
                              : `started ${format(
                                  new Date(incident.data.startTime),
                                  "dd MMMM yyyy HH:mm",
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
                              className={classNames(
                                isSubmitting
                                  ? "px-4 disabled:opacity-50 cursor-not-allowed"
                                  : "",
                                "ml-3 border-transparent text-white bg-blue-600 hover:bg-blue-700"
                              )}
                              disabled={isSubmitting}
                            >
                              {isSubmitting && <Spinner />}
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </ButtonCircle>
                          </div>
                        </CardTitle>
                        <CardContent>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-900">
                              Application
                            </dt>
                            <dd className="mt-1 text-sm text-gray-500">
                              {incident.data.paramApps
                                ? incident.data.paramApps.subName
                                : "Not defined yet"}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <label
                              htmlFor="incident-type"
                              className="block text-sm font-medium text-gray-900"
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
                                  className={classNames(
                                    errors.idIncidentType
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                  )}
                                  options={incidentTypeOptions}
                                  styles={styledReactSelect}
                                  placeholder="Select incident type..."
                                />
                              )}
                            />
                            {errors.idIncidentType && (
                              <p className="text-sm text-red-600">
                                {errors.idIncidentType.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-1">
                            <label
                              htmlFor="start-time"
                              className="mb-1 block text-sm font-medium text-gray-900"
                            >
                              Start Time
                            </label>
                            <Controller
                              control={control}
                              rules={{ required: "This is required" }}
                              name="logStartTime"
                              render={({ field }) => (
                                <DatePicker
                                  allowClear
                                  placeholder="When the incident actually happen?"
                                  showTime={{ format: "HH:mm" }}
                                  format="d MMMM yyyy HH:mm"
                                  onChange={(e) => field.onChange(e)}
                                  value={field.value}
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "100%",
                                    height: "38px",
                                  }}
                                />
                              )}
                            />
                            {errors.logStartTime && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.logStartTime.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-1">
                            <label
                              htmlFor="detected-time"
                              className="mb-1 block text-sm font-medium text-gray-900"
                            >
                              Detected Time
                            </label>
                            <Controller
                              control={control}
                              rules={{
                                required: "This is required",
                                validate: handleStartTime,
                              }}
                              name="startTime"
                              render={({ field }) => (
                                <DatePicker
                                  allowClear
                                  placeholder="When we aware/identified the incident?"
                                  showTime={{ format: "HH:mm" }}
                                  format="d MMMM yyyy HH:mm"
                                  onChange={(e) => field.onChange(e)}
                                  value={field.value}
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "100%",
                                    height: "38px",
                                  }}
                                />
                              )}
                            />
                            {errors.startTime?.type === "validate" && (
                              <p className="mt-2 text-sm text-red-600">
                                Detected time can't be less than start time
                              </p>
                            )}
                            {errors.startTime && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.startTime.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="end-time"
                              className="mb-1 block text-sm font-medium text-gray-900"
                            >
                              End Time
                            </label>
                            <Controller
                              name="endTime"
                              control={control}
                              rules={{
                                required: "This is required",
                                validate: handleDatetime,
                              }}
                              render={({ field }) => (
                                <DatePicker
                                  allowClear
                                  placeholder="Thank God the incident is over"
                                  showTime={{ format: "HH:mm" }}
                                  format="d MMMM yyyy HH:mm"
                                  onChange={(e) => field.onChange(e)}
                                  value={field.value}
                                  defaultValue={parseISO(
                                    incident.data.endTime,
                                    new Date()
                                  )}
                                  style={{
                                    borderRadius: "0.375rem",
                                    width: "100%",
                                    height: "38px",
                                  }}
                                />
                              )}
                            />
                            {errors.endTime?.type === "validate" && (
                              <p className="mt-2 text-sm text-red-600">
                                End time must be greater than log or start time
                              </p>
                            )}
                            {errors.endTime && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.endTime.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="urgency"
                              className="block text-sm font-medium text-gray-900"
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
                                  isClearable
                                  className={classNames(
                                    errors.idUrgency
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                  )}
                                  options={urgencyOptions}
                                  styles={styledReactSelect}
                                  placeholder="Select urgency..."
                                />
                              )}
                            />
                            {errors.idUrgency && (
                              <p className="text-sm text-red-600">
                                {errors.idUrgency.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <label
                              htmlFor="impact"
                              className="block text-sm font-medium text-gray-900"
                            >
                              Impact
                            </label>
                            <Controller
                              name="idImpact"
                              control={control}
                              rules={{ required: "This is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  isClearable
                                  className={classNames(
                                    errors.idImpact
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                  )}
                                  options={impactOptions}
                                  styles={styledReactSelect}
                                  placeholder="Select impact..."
                                />
                              )}
                            />
                            {errors.idImpact && (
                              <p className="text-sm text-red-600">
                                {errors.idImpact.message}
                              </p>
                            )}
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-900">
                              Affected System
                            </dt>
                            <textarea
                              id="impact-system"
                              {...register("impactedSystem", {
                                required: "This is required!",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.impactedSystem
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="What service/system that impacted?"
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
                            <dt className="text-sm font-medium text-gray-900">
                              Root Cause
                            </dt>
                            <textarea
                              id="root-cause"
                              {...register("rootCause", {
                                required: "This is required!",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.rootCause
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="Explain the Root Cause Analysis"
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
                            <dt className="text-sm font-medium text-gray-900">
                              Action Items
                            </dt>
                            <textarea
                              id="action-items"
                              {...register("actionItem", {
                                required: "This is required!",
                                minLength: {
                                  value: 30,
                                  message:
                                    "Please lengthen this text to 30 characters or more.",
                                },
                              })}
                              rows={5}
                              className={classNames(
                                errors.actionItem
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="What do we do to fix the incident? What happened?"
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
                          <div className="flex items-center space-x-3 sm:col-span-2">
                            <Switch
                              checked={enhancement}
                              onChange={handleSwitch}
                              className={classNames(
                                enhancement ? "bg-blue-600" : "bg-gray-200",
                                "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              )}
                            >
                              <span className="sr-only">
                                Need permanent fix?
                              </span>
                              <span
                                aria-hidden="true"
                                className={classNames(
                                  enhancement
                                    ? "translate-x-5"
                                    : "translate-x-0",
                                  "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                                )}
                              />
                            </Switch>
                            <div>
                              <label className="block text-sm font-regular text-gray-700">
                                Need improvement or permanent fix?
                              </label>
                              <span className="inline-block align-top text-xs text-gray-400">
                                Please switch the toggle if the incident need
                                improvement or permanent fix
                              </span>
                            </div>
                          </div>
                          {enhancement === true && (
                            <>
                              <div className="sm:col-span-1">
                                <label
                                  htmlFor="log-start"
                                  className="mb-1 block text-sm font-medium text-gray-900"
                                >
                                  Problem Type
                                </label>
                                <Controller
                                  name="idProblemType"
                                  control={control}
                                  rules={{ required: "This is required!" }}
                                  render={({ field }) => (
                                    <Select
                                      {...field}
                                      isClearable
                                      className={classNames(
                                        errors.idProblemType
                                          ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                          : "focus:ring-blue-500 focus:border-blue-500",
                                        "block w-full py-2 text-base border-gray-300 sm:text-sm rounded-md"
                                      )}
                                      options={enhanceOptions}
                                      styles={styledReactSelect}
                                      placeholder="Select Problem Type"
                                    />
                                  )}
                                />
                                {errors.idProblemType && (
                                  <p className="text-sm text-red-600">
                                    {errors.idProblemType.message}
                                  </p>
                                )}                              
                              </div>
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-900">
                                  Proposed Enhancement
                                </dt>
                                <textarea
                                  id="proposed-enhancement"
                                  {...register("proposedEnhancement", {
                                    required: "This is required!",
                                    minLength: {
                                      value: 30,
                                      message:
                                        "Please lengthen this text to 30 characters or more.",
                                    },
                                  })}
                                  rows={4}
                                  className={classNames(
                                    errors.proposedEnhancement
                                      ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                      : "focus:ring-blue-500 focus:border-blue-500",
                                    "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                  )}
                                  placeholder="What should be done to avoid this in future?"
                                  defaultValue={
                                    incident.data.proposedEnhancement
                                      ? incident.data.proposedEnhancement
                                      : ""
                                  }                                
                                />
                                {errors.proposedEnhancement && (
                                  <p className="mt-1 text-sm text-red-600">
                                    {errors.proposedEnhancement.message}
                                  </p>
                                )}
                              </div>
                            </>
                          )}
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-900">
                              Lesson Learned
                            </dt>
                            <textarea
                              id="action-items"
                              {...register("lessonLearned", {
                                required: "This is required!",
                              })}
                              rows={4}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="The lesson that we take from this incident."
                              defaultValue={
                                incident.data.lessonLearned
                                  ? incident.data.lessonLearned
                                  : ""
                              }
                            />
                            {errors.lessonLearned && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.lessonLearned.message}
                              </p>
                            )}                            
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-900">
                              Responsible Team
                            </dt>
                            <textarea
                              id="responsible-engineer"
                              {...register("responsibleEngineer", {
                                required: "This is required!",
                              })}
                              rows={3}
                              className={classNames(
                                errors.responsibleEngineer
                                  ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                  : "focus:ring-blue-500 focus:border-blue-500",
                                "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              )}
                              placeholder="The person(s) who attended the support call and had most context of what happened."
                              defaultValue={
                                incident.data.responsibleEngineer
                                  ? incident.data.responsibleEngineer
                                  : ""
                              }
                            />
                            {errors.responsibleEngineer && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.responsibleEngineer.message}
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
                                "dd MMMM yyyy HH:mm",
                                "id-ID"
                              )}`
                        }
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
                      <CardContent>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-900">
                            Application
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.paramApps
                              ? incident.data.paramApps.subName
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-900">
                            Incident Priority
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.paramPriorityMatrix
                              ? incident.data.paramPriorityMatrix.mapping
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Urgency
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.paramUrgency
                              ? incident.data.paramUrgency.urgency
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Impact
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.paramImpact
                              ? incident.data.paramImpact.impact
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Affected System
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.impactedSystem
                              ? incident.data.impactedSystem
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Root Cause
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.rootCause
                              ? incident.data.rootCause
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Action Items
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.actionItem
                              ? incident.data.actionItem
                              : "Not defined yet"}
                          </dd>
                        </div>
                        {incident.data.isProblem !== 'N' && (
                          <>
                            <div className="sm:col-span-2">
                              <dt className="text-sm font-medium text-gray-900">
                                Proposed Enhancement
                              </dt>
                              <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                                {incident.data.proposedEnhancement
                                  ? incident.data.proposedEnhancement
                                  : "No need improvement"}
                              </dd>
                            </div>
                          </>
                        )}
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Lesson Learned
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.lessonLearned
                              ? incident.data.lessonLearned
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-900">
                            Responsible Team
                          </dt>
                          <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-500">
                            {incident.data.responsibleEngineer
                              ? incident.data.responsibleEngineer
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
                      <h2 className="text-sm font-medium text-gray-900">
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
                            <div className="ml-3.5 text-sm font-medium text-gray-600">
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
                            <div className="ml-3.5 text-sm font-medium text-gray-600">
                              {incident.data.paramApps
                                ? incident.data.paramApps.criticalityApp
                                : "-"}
                            </div>
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                    <h2 className="text-sm font-medium text-gray-900">
                      Time to Discover
                    </h2>
                    <div className="flex items-center space-x-2">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-yellow-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600 text-sm">
                        {`Detect : ${incident.data.detectIntervals} minutes`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RefreshIcon
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600 text-sm">
                        {incident.data.resolvedIntervals
                          ? `Recover : ${incident.data.resolvedIntervals} minutes`
                          : "Not recovered yet"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">
                        From{" "}
                        {incident.data.logStartTime
                          ? format(
                              new Date(incident.data.logStartTime),
                              "dd MMMM yyyy HH:mm",
                              "id-ID"
                            )
                          : "-"}{" "}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">
                        Until{" "}
                        {incident.data.endTime
                          ? format(
                              new Date(incident.data.endTime),
                              "dd MMMM yyyy HH:mm",
                              "id-ID"
                            )
                          : "(not recovered yet)"}{" "}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-sm font-medium text-gray-900">
                        Improvement
                      </h2>
                      <ul className="mt-2 leading-8">
                        <li className="inline">
                          <a
                            href="#"
                            className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5"
                          >
                            <div className="absolute flex-shrink-0 flex items-center justify-center">
                              <span
                                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
                                aria-hidden="true"
                              />
                            </div>
                            <div className="ml-3.5 text-sm font-medium text-gray-600">
                              {incident.data.paramFollowUpPlan
                                ? incident.data.paramFollowUpPlan.followUpPlan
                                : "None"}
                            </div>
                          </a>{" "}
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 space-y-4 px-4 py-5 sm:px-6">
                    <h2 className="text-sm font-medium text-gray-900">
                      Reporter
                    </h2>
                    <div className="flex items-center space-x-2">
                      <UserCircleIcon
                        className="h-6 w-6 text-gray-500"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600 text-sm">
                        {incident.data.paramCreatedBy
                          ? incident.data.paramCreatedBy.fullname
                          : "undefined"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-600 text-sm">
                        Last updated on{" "}
                        {incident.data.updatedAt
                          ? format(
                              new Date(incident.data.updatedAt),
                              "dd MMM yyyy HH:mm",
                              "id-ID"
                            )
                          : format(
                              new Date(incident.data.createdAt),
                              "dd MMM yyyy HH:mm",
                              "id-ID"
                            )}{" "}
                        <br />
                        by{" "}
                        {incident.data.paramUpdatedBy
                          ? incident.data.paramUpdatedBy.fullname
                          : incident.data.paramCreatedBy.fullname}
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
