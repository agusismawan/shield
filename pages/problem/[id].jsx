/* eslint-disable react-hooks/rules-of-hooks */
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import format from "date-fns/format";
import withSession from "lib/session";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { useEffect, useState } from "react";
import { StatusPill, SourcePill } from "components/problems/status-badge";
import { CardTitle } from "components/ui/card-title";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { ButtonCircle } from "components/ui/button/button-circle";
import { Spinner } from "components/ui/spinner";
import ModalRootCause from "components/problems/modal-rootcause";
import {
  styledReactSelect,
  styledReactSelectAdd,
} from "../../components/utils";
import {
  PencilIcon,
  XIcon,
  CheckIcon,
  CalendarIcon,
  UserCircleIcon,
} from "@heroicons/react/solid";

import * as ProblemHelper from "components/problems/problem-helper";

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
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${params.id}`
  );
  const data = await res.json();
  let step = [];
  if (data.data.problemStatus.id) {
    for (let loop = 1; loop <= 4; loop++) {
      if (loop < data.data.problemStatus.id) {
        step.push({ name: `Step ${loop}`, status: "complete" });
      } else if (loop == data.data.problemStatus.id) {
        step.push({ name: `Step ${loop}`, status: "current" });
      } else if (loop > data.data.problemStatus.id) {
        step.push({ name: `Step ${loop}`, status: "upcoming" });
      } else {
      }
    }
  }
  return {
    props: {
      user: user,
      problem: data.data,
      idProblem: params.id,
      steps: step,
    },
  };
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function ProblemDetail({ user, problem, idProblem, steps }) {
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  const [editMode, setEditMode] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      problemName: problem.problemName,
      idApps: problem.app
        ? {
            label: problem.app.subname,
            value: problem.app.id,
          }
        : false,
      jiraProblem: problem.jiraProblem,
      changeManagement: problem.followupCM,
      idUrgency: problem.urgency
        ? {
            label: problem.urgency.urgency,
            value: problem.urgency.id,
          }
        : false,
      idImpact: problem.impact
        ? {
            label: problem.impact.impact,
            value: problem.impact.id,
          }
        : false,
      idSource: problem.problemSource
        ? {
            label: problem.problemSource.label,
            value: problem.problemSource.id,
          }
        : false,
      idStatus: problem.problemStatus
        ? {
            label: problem.problemStatus.label,
            value: problem.problemStatus.id,
          }
        : false,
      idFollowup: problem.followUp
        ? {
            label: problem.followUp.label,
            value: problem.followUp.id,
          }
        : false,
    },
  });

  const router = useRouter();

  // Get data User
  const [assignOptions, setAssignOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/user/assigned/aes`)
      .then((response) => {
        const data = response.data.data.map((user) => ({
          value: user.id,
          label: user.fullName,
        }));
        setAssignOptions(data);
      })
      .catch((err) => toast.error(`Assign ${err}`));
  }, []);

  const onUpdateStatus = async (data) => {
    Object.assign(data, {
      idStatus: { value: data.idStatus.value + 1 },
      updatedBy: user.id,
    });
    if (data.jiraProblem === "" || problem.jiraProblem == null) {
      toast.error(`Failed to update: Link JIRA harus diisi`);
    } else {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${problem.id}`,
          data,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success("Status Successfully Updated");
            setTimeout(() => router.reload(), 1000);
          } else {
            toast.error(`Failed to update: ${response.data.message}`);
          }
        })
        .catch(function (error) {
          setSpinner(false);
          toast.error(`Failed to update: ${error.response.data.message}`);
        });
    }
  };

  const onSubmit = async (data) => {
    let matrixChanged = "N";
    if (
      problem.impact.id !== data.idImpact.value ||
      problem.urgency.id !== data.idUrgency.value
    ) {
      matrixChanged = "Y";
    }

    Object.assign(data, {
      id: problem.id,
      idStatus: { value: data.idStatus.value },
      updatedBy: user.id,
      matrixChanged: matrixChanged,
    });
    if (data.jiraProblem === "") {
      toast.error(`Failed to update: Link JIRA harus diisi`);
    } else {
      if (data.jiraProblem.includes("jira.bri.co.id")) {
        setSpinner(true);
        axios
          .put(
            `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/${problem.id}`,
            data,
            {
              headers: { Authorization: `Bearer ${user.accessToken}` },
            }
          )
          .then(function (response) {
            if (response) {
              toast.success("Problem Successfully Updated");
              setTimeout(() => router.reload(), 1000);
            } else {
              toast.error(`Failed to update: ${response.data.message}`);
            }
          })
          .catch(function (error) {
            toast.error(`Failed to update: ${error.response.data.message}`);
          });
      } else {
        toast.error(`Failed to update: Must attach JIRA BRI`);
      }
    }
  };

  const makeAssign = async (data, event) => {
    event.preventDefault();
    let dataAssign = {};
    Object.assign(dataAssign, {
      idStatus: 2,
      updatedBy: user.id,
      assignedTo: parseInt(event.target.assignedTo.value),
    });
    if (dataAssign.assignedTo) {
      setSpinner(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_PROBMAN}/incident/recprob/${idProblem}`,
          dataAssign,
          {
            headers: { Authorization: `Bearer ${user.accessToken}` },
          }
        )
        .then(function (response) {
          if (response) {
            toast.success("Problem Sucessfully Assigned");
            setTimeout(() => router.reload(), 1000);
          }
        })
        .catch((error) => {
          if (error.response) {
            toast.error(
              `${error.response.data.message} (Code: ${error.response.status})`
            );
          } else if (error.request) {
            toast.error(`Request: ${error.request}`);
          } else {
            toast.error(`Message: ${error.message}`);
          }
        });
    } else {
      toast.error("Team Member sebagai Investigator belum dipilih");
    }
  };

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

  const NoOptionsMessage = (props) => {
    return (
      <components.NoOptionsMessage {...props}>
        <span>Type at least 3 letters of application name</span>
      </components.NoOptionsMessage>
    );
  };

  // Get data Urgency
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/urgency?isActive=Y`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.urgency,
        }));
        setUrgencyOptions(data);
      })
      .catch((err) => toast.error(`Urgency ${err}`));
  }, []);

  // Get data Impact
  const [impactOptions, setImpactOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/impact?isActive=Y`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.impact,
        }));
        setImpactOptions(data);
      })
      .catch((err) => toast.error(`Impact ${err}`));
  }, []);

  // Get data Source Problem
  const [sourceOptions, setSourceOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/source/all`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setSourceOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Follow Up Problem
  const [followupOptions, setFollowupOptions] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_PROBMAN}/followup/all`)
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setFollowupOptions(data);
      })
      .catch((err) => toast.error(`Follow Up ${err}`));
  }, []);

  return (
    <>
      <Layout key={`LayoutProblemDetail-${problem.id}`} session={user}>
        <Head>
          <title>
            {problem.problemNumber} {problem.app ? problem.app.subname : null} -
            Shield
          </title>
        </Head>
        <section>
          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-full lg:px-12">
              <div className="flex items-center space-x-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {problem.problemName}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    Created by&nbsp;
                    <a href="#" className="text-gray-900">
                      {problem.created_by.fullName
                        ? problem.created_by.fullName
                        : problem.created_by.userName}
                    </a>{" "}
                    on{" "}
                    <time
                      dateTime={format(
                        new Date(problem.createdAt),
                        "d LLLL yyyy HH:mm",
                        "id-ID"
                      )}
                    >
                      {format(
                        new Date(problem.createdAt),
                        "d LLLL yyyy HH:mm",
                        "id-ID"
                      )}
                    </time>
                  </p>
                </div>
              </div>

              {/* coba gatau */}
              {problem.assigned_to ? (
                user.username === problem.assigned_to.userName ? (
                  problem.problemStatus.id === 2 ? (
                    <form onSubmit={handleSubmit(onUpdateStatus)}>
                      <button
                        type="submit"
                        className={classNames(
                          spinner
                            ? "px-4 disabled:opacity-50 cursor-not-allowed"
                            : null,
                          "w-100 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        )}
                        disabled={spinner}
                      >
                        {spinner && <Spinner />}
                        Update Ongoing at JIRA
                      </button>
                    </form>
                  ) : null
                ) : null
              ) : null}

              {problem.assigned_to ? (
                user.username === problem.assigned_to.userName ? (
                  problem.problemStatus.id === 3 ? (
                    <ModalRootCause problem={problem} user={user} />
                  ) : null
                ) : null
              ) : null}
            </div>

            <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
              <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                {/* Problem Detail */}
                <section aria-labelledby="problem-detail">
                  <div className="bg-white shadow sm:rounded-lg">
                    {editMode ? (
                      <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <section aria-labelledby="edit-problem">
                            <CardTitle
                              // title={`Problem Number ${problem.problemNumber}`}
                              title={
                                problem.problemNumber !== null
                                  ? `Problem Number ${problem.problemNumber}`
                                  : `Problem Number -`
                              }
                              subtitle={
                                <li className="inline">
                                  <div className="relative inline-flex items-center">
                                    <div className="absolute flex-shrink-0 flex items-center justify-center">
                                      <span
                                        className="h-1.5 w-1.5 rounded-full bg-gray-500"
                                        aria-hidden="true"
                                      />
                                    </div>
                                    <div className="ml-3.5 text-sm font-medium text-gray-900">
                                      Criticality : {problem.app.criticalityApp}
                                    </div>
                                  </div>{" "}
                                </li>
                              }
                            >
                              <div className="px-4 flex">
                                <ButtonCircle
                                  action={() => {
                                    setEditMode(false);
                                    reset();
                                  }}
                                  className="border-transparent text-white bg-rose-600 hover:bg-rose-700"
                                >
                                  <XIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </ButtonCircle>
                                <ButtonCircle
                                  action={handleSubmit(onSubmit)}
                                  className={classNames(
                                    spinner
                                      ? "px-4 disabled:opacity-50 cursor-not-allowed"
                                      : null,
                                    "ml-3 border-transparent text-white bg-blue-600 hover:bg-blue-700"
                                  )}
                                  disabled={spinner}
                                >
                                  {spinner && <Spinner />}
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </ButtonCircle>
                              </div>
                            </CardTitle>
                            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                              <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Problem Name
                                  </label>
                                  <div className="pt-1">
                                    <textarea
                                      id="problemName"
                                      name="problemName"
                                      {...register("problemName", {
                                        required: "This is required!",
                                        minLength: {
                                          value: 10,
                                          message:
                                            "Please lengthen this text to 10 characters or more.",
                                        },
                                        maxLength: {
                                          value: 60,
                                          message:
                                            "Please shorten this text to 60 characters or less.",
                                        },
                                      })}
                                      rows={1}
                                      style={{
                                        resize: "none",
                                      }}
                                      className={classNames(
                                        errors.problemName
                                          ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                          : "focus:ring-blue-500 focus:border-blue-500",
                                        "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                      )}
                                      placeholder="Problem Happening"
                                      defaultValue={problem.problemName}
                                    />
                                    {errors.problemName && (
                                      <p className="mt-1 text-sm text-red-600">
                                        {errors.problemName.message}
                                      </p>
                                    )}
                                  </div>
                                  <p className="pt-2 text-sm text-gray-500">
                                    Edit a few sentences about problem.
                                  </p>
                                </div>

                                <div className="sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Application
                                  </label>
                                  <Controller
                                    name="idApps"
                                    control={control}
                                    rules={{ required: "This is required" }}
                                    defaultValue={problem.app.id}
                                    render={({ field }) => (
                                      <AsyncSelect
                                        {...field}
                                        isClearable
                                        loadOptions={loadApplications}
                                        styles={styledReactSelectAdd}
                                        className="pt-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Search for application"
                                        components={{ NoOptionsMessage }}
                                      />
                                    )}
                                  />
                                  {errors.idApps && (
                                    <p className="mt-2 text-sm text-red-600">
                                      {errors.idApps.message}
                                    </p>
                                  )}
                                </div>

                                <div className="sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Link JIRA
                                  </label>
                                  <div className="pt-1">
                                    <textarea
                                      id="jiraProblem"
                                      name="jiraProblem"
                                      {...register("jiraProblem", {
                                        required: "This is required!",
                                      })}
                                      rows={1}
                                      style={{
                                        resize: "none",
                                      }}
                                      className={classNames(
                                        errors.jiraProblem
                                          ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                                          : "focus:ring-blue-500 focus:border-blue-500",
                                        "shadow-sm mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                      )}
                                      placeholder="Link JIRA"
                                      defaultValue={problem.jiraProblem}
                                    />
                                    {errors.jiraProblem && (
                                      <p className="mt-1 text-sm text-red-600">
                                        {errors.jiraProblem.message}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Urgency
                                  </label>
                                  <div className="pt-1">
                                    <Controller
                                      name="idUrgency"
                                      control={control}
                                      rules={{ required: "This is required" }}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          isClearable
                                          options={urgencyOptions}
                                          styles={styledReactSelect}
                                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      )}
                                    />
                                    {errors.idUrgency && (
                                      <p className="pt-2 text-sm text-red-600">
                                        {errors.idUrgency.message}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Impact
                                  </label>
                                  <div className="pt-1">
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
                                </div>

                                <div className="sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Source
                                  </label>
                                  <div className="pt-1">
                                    <Controller
                                      name="idSource"
                                      control={control}
                                      rules={{ required: "This is required" }}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          isClearable
                                          options={sourceOptions}
                                          styles={styledReactSelect}
                                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      )}
                                    />
                                    {errors.idSource && (
                                      <p className="pt-2 text-sm text-red-600">
                                        {errors.idSource.message}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="sm:col-span-1">
                                  <label className="block text-sm font-medium text-gray-700">
                                    Follow Up Plan
                                  </label>
                                  <div className="pt-1">
                                    <Controller
                                      name="idFollowup"
                                      control={control}
                                      rules={{ required: "This is required" }}
                                      render={({ field }) => (
                                        <Select
                                          {...field}
                                          isClearable
                                          options={followupOptions}
                                          styles={styledReactSelect}
                                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      )}
                                    />
                                    {errors.idFollowup && (
                                      <p className="pt-2 text-sm text-red-600">
                                        {errors.idFollowup.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </section>
                        </form>
                      </>
                    ) : (
                      <>
                        <CardTitle
                          title={
                            problem.problemNumber !== null
                              ? `Problem Number ${problem.problemNumber}`
                              : `Problem Number -`
                          }
                          subtitle={
                            <>
                              <li className="inline">
                                <div className="relative inline-flex items-center">
                                  <div className="absolute flex-shrink-0 flex items-center justify-center">
                                    <span
                                      className="h-1.5 w-1.5 rounded-full bg-gray-500"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    Criticality : {problem.app.criticalityApp}
                                  </div>
                                </div>
                                <div className="sm:col-span-1">
                                  <span
                                    className="h-1.5 w-1.5 rounded-full bg-gray-500"
                                    aria-hidden="true"
                                  />
                                  <dt className="text-sm font-medium text-gray-500">
                                    Status :{" "}
                                    {problem.problemStatus.label ? (
                                      <StatusPill
                                        value={problem.problemStatus.label}
                                      />
                                    ) : (
                                      "Not defined yet"
                                    )}
                                  </dt>
                                </div>
                              </li>

                              {/* <li className="inline">
                                <div className="relative inline-flex items-center">
                                  <div className="absolute flex-shrink-0 flex items-center justify-center">
                                    <span
                                      className="h-1.5 w-1.5 rounded-full bg-gray-500"
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <div className="ml-3.5 text-sm font-medium text-gray-900">
                                    Status
                                    {problem.problemStatus.label ? (
                                      <StatusPill
                                        value={problem.problemStatus.label}
                                      />
                                    ) : (
                                      "Not defined yet"
                                    )}
                                  </div>
                                </div>{" "}
                              </li> */}
                            </>
                          }
                        >
                          <nav
                            className="flex items-center justify-left"
                            aria-label="Progress"
                          >
                            <p className="text-sm font-medium">
                              {`Progress ${problem.problemStatus.id} of 4`}
                            </p>
                            <ol className="ml-8 flex items-center space-x-5">
                              {steps.map((step) => (
                                <li key={step.name}>
                                  {step.status === "complete" ? (
                                    <div className="block w-2.5 h-2.5 bg-indigo-600 rounded-full hover:bg-indigo-900">
                                      <span className="sr-only">
                                        {step.name}
                                      </span>
                                    </div>
                                  ) : step.status === "current" ? (
                                    <div
                                      className="relative flex items-center justify-center"
                                      aria-current="step"
                                    >
                                      <span
                                        className="absolute w-5 h-5 p-px flex"
                                        aria-hidden="true"
                                      >
                                        <span className="w-full h-full rounded-full bg-indigo-200" />
                                      </span>
                                      <span
                                        className="relative block w-2.5 h-2.5 bg-indigo-600 rounded-full"
                                        aria-hidden="true"
                                      />
                                      <span className="sr-only">
                                        {step.name}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400">
                                      <span className="sr-only">
                                        {step.name}
                                      </span>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ol>
                            <div className="px-4 flex ml-3 mb-4">
                              {problem.assigned_to ? (
                                user.username ===
                                problem.assigned_to.userName ? (
                                  problem.problemStatus.id !== 4 ? (
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
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )}
                            </div>
                          </nav>
                        </CardTitle>
                        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                Application
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {problem.app.subname
                                  ? problem.app.subname
                                  : "Not defined yet"}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                Link JIRA
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {problem.jiraProblem ? (
                                  <a
                                    href={problem.jiraProblem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {problem.jiraProblem}
                                  </a>
                                ) : (
                                  "Not Defined Yet"
                                )}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                Urgency
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {problem.urgency.urgency
                                  ? problem.urgency.urgency
                                  : "Not defined yet"}
                              </dd>
                            </div>
                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                Impact
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {problem.impact.impact
                                  ? problem.impact.impact
                                  : "Not defined yet"}
                              </dd>
                            </div>

                            <div className="sm:col-span-1">
                              <dt className="text-sm font-medium text-gray-500">
                                Source
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900">
                                {problem.problemSource.label ? (
                                  <SourcePill
                                    value={problem.problemSource.label}
                                  />
                                ) : (
                                  "Not defined yet"
                                )}
                              </dd>
                            </div>

                            {problem.problemStatus.id === 4 &&
                            problem.followUp.label.includes("CM") ? (
                              <div className="sm:col-span-1">
                                <dt className="text-sm font-medium text-gray-500">
                                  Link Change Management
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900">
                                  {problem.followupCM ? (
                                    <a
                                      href={problem.followupCM}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {problem.followupCM}
                                    </a>
                                  ) : (
                                    "Not Defined Yet"
                                  )}
                                </dd>
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      </>
                    )}
                  </div>
                </section>

                {/* Condition Incident Table */}
                {problem.incidents.length > 0 ? (
                  <>
                    <h1 className="text-2xl font-bold text-gray-400">
                      Related Incident
                    </h1>
                    <section aria-labelledby="incident-table">
                      <div className="bg-white shadow sm:rounded-lg">
                        <table className="min-w-full" role="table">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                Number
                              </th>
                              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                Incident Name
                              </th>
                              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                Root Cause
                              </th>
                              <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase">
                                Reported at
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {problem.incidents.map((incident) => (
                              <>
                                <tr key={`${incident.incidentNumber}`}>
                                  <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                    <Link
                                      href={`/incidents/${incident.id}`}
                                      passHref
                                    >
                                      <a
                                        className="text-blue-500 hover:text-blue-900"
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {incident.incidentNumber}
                                      </a>
                                    </Link>
                                  </td>
                                  <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                    {incident.incidentName}
                                  </td>
                                  <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                    {incident.rootCause
                                      ? incident.rootCause
                                      : null}
                                  </td>
                                  <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                                    {format(
                                      new Date(incident.createdAt),
                                      "d LLLL yyyy HH:mm",
                                      "id-ID"
                                    )}
                                  </td>
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </>
                ) : null}
              </div>

              <section
                aria-labelledby="timeline-title"
                className="lg:col-start-3 lg:col-span-1"
              >
                <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                  {/* Problem Info */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-medium text-gray-900">
                      Problem Detail
                    </h2>
                    <ul className="mt-2 leading-8">
                      <li className="inline">
                        <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-rose-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Priority : {problem.priorityMatrix.mapping}
                          </div>
                        </div>{" "}
                      </li>
                      <li className="inline">
                        <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-yellow-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Type : {problem.paramType.type}
                          </div>
                        </div>{" "}
                      </li>
                      <li className="inline">
                        <div className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5">
                          <div className="absolute flex-shrink-0 flex items-center justify-center">
                            <span
                              className="h-1.5 w-1.5 rounded-full bg-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                          <div className="ml-3.5 text-sm font-medium text-gray-900">
                            Follow Up :{" "}
                            {problem.followUp ? problem.followUp.label : null}
                          </div>
                        </div>{" "}
                      </li>
                    </ul>
                    {problem.problemStatus.id === 4 ? (
                      <>
                        <h2 className="text-sm font-medium text-gray-900">
                          Timestamp
                        </h2>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon
                            className="h-5 w-5 text-emerald-600"
                            aria-hidden="true"
                          />
                          <span className="text-gray-900 text-sm">
                            Solved on{" "}
                            <time
                              dateTime={format(
                                new Date(problem.updatedAt),
                                "d LLLL yyyy HH:mm",
                                "id-ID"
                              )}
                            >
                              {` ${format(
                                new Date(problem.updatedAt),
                                "d LLLL yyyy HH:mm",
                                "id-ID"
                              )}`}
                            </time>
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>

                {/* Reporter */}
                <div className="bg-white shadow sm:rounded-lg mt-3">
                  <div className="space-y-4 px-4 py-5 sm:px-6">
                    <h2 className="text-sm font-medium text-gray-900">
                      Assigned To
                    </h2>

                    {problem.assigned_to ? (
                      <div className="flex items-center space-x-2">
                        <UserCircleIcon
                          className="h-6 w-6 text-gray-500"
                          aria-hidden="true"
                        />
                        <span className="text-gray-600 text-sm">
                          {problem.assigned_to.fullName}
                        </span>
                      </div>
                    ) : ProblemHelper.checkTLAES(user) ? (
                      <>
                        <form onSubmit={handleSubmit(makeAssign)}>
                          <Controller
                            name="assignedTo"
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                isClearable
                                options={assignOptions}
                                styles={styledReactSelect}
                                className="block w-60 text-sm focus:ring-blue-500 focus:border-blue-500"
                              />
                            )}
                          />
                          <button
                            type="submit"
                            className={classNames(
                              spinner
                                ? "px-4 disabled:opacity-50 cursor-not-allowed"
                                : null,
                              "mt-4 w-60 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            )}
                            disabled={spinner}
                          >
                            {spinner && <Spinner />}
                            Submit
                          </button>
                          {errors.assignedTo && (
                            <p className="pt-2 text-sm text-red-600">
                              {errors.assignedTo.message}
                            </p>
                          )}
                        </form>
                      </>
                    ) : (
                      "Not Yet Assigned"
                    )}

                    {problem.updated_by !== null ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600 text-sm">
                          Last updated on{" "}
                          {format(
                            new Date(problem.updatedAt),
                            "d LLLL yyyy HH:mm",
                            "id-ID"
                          )}
                          <br />
                          by {problem.updated_by.fullName}
                        </span>
                      </div>
                    ) : null}
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
