import { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { Disclosure, Switch } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import format from "date-fns/format";
import DatePicker from "../../components/ui/datepicker";
import "antd/dist/antd.css";
import { toast } from "react-toastify";
import Layout from "../../components/layout";
import { Input } from "../../components/ui/forms";
import { classNames, styledReactSelect } from "../../components/utils";
import { ButtonSmall, ButtonSecondary } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import PageHeader from "../../components/incidents/page-header";
import docs from "../../components/incidents/docs.json";
import withSession from "../../lib/session";

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

  return {
    props: {
      user: req.session.get("user"),
    },
  };
});

function addIncident({ user }) {
  // Digunakan utuk fungsi reset form
  const defaultValues = {
    incidentName: "",
    idApps: null,
    startTime: null,
    logStartTime: null,
    idUrgency: null,
    endTime: null,
    idImpact: null,
    impactedSystem: "",
    rootCause: "",
    actionItem: "",
    responsibleEngineer: "",
  };
  const { register, handleSubmit, control, formState, reset, getValues } =
    useForm({
      defaultValues,
    });
  const { errors, isSubmitting } = formState;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);

  // Get data urgency
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

  // Get data impact
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

  // Get data applications with async
  const loadApplications = (value, callback) => {
    clearTimeout(timeoutId);

    if (value.length < 3) {
      return callback([]);
    }

    const timeoutId = setTimeout(() => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/parameters/app?name=${value}`)
        .then((res) => {
          const cachedOptions = res.data.data.map((d) => ({
            value: d.id,
            label: d.name,
          }));

          callback(cachedOptions);
        })
        .catch((err) => toast.error(`Application ${err}`));
    }, 500);
  };

  // Handle switch button when incident is over
  const handleSwitch = () => {
    if (enabled) {
      reset({
        endTime: null,
        impactedSystem: "",
        idUrgency: null,
        idImpact: null,
        rootCause: "",
        actionItem: "",
        responsibleEngineer: "",
      });
      setEnabled(false);
    } else {
      setEnabled(true);
    }
  };

  // Handle validate datetime
  const handleDatetime = () => {
    const st = new Date(getValues("startTime"));
    const et = new Date(getValues("endTime"));
    const ls = new Date(getValues("logStartTime"));

    return (
      st.setSeconds(0, 0) < et.setSeconds(0, 0) &&
      st.setSeconds(0, 0) < ls.setSeconds(0, 0)
    );
  };

  const onSubmit = async (data, e) => {
    e.preventDefault();
    await sleep(1000);

    // Destructuring object to fit format on API
    if (!data.endTime || data.endTime === null || data.endTime === "") {
      Object.assign(data, {
        idApps: data.idApps.value,
        startTime: format(new Date(data.startTime), "yyyy-MM-dd HH:mm:ss"),
        logStartTime: format(
          new Date(data.logStartTime),
          "yyyy-MM-dd HH:mm:ss"
        ),
      });
    } else {
      Object.assign(data, {
        idApps: data.idApps.value,
        startTime: format(new Date(data.startTime), "yyyy-MM-dd HH:mm:ss"),
        logStartTime: format(
          new Date(data.logStartTime),
          "yyyy-MM-dd HH:mm:ss"
        ),
        idUrgency: data.idUrgency.value,
        idImpact: data.idImpact.value,
        endTime: format(new Date(data.endTime), "yyyy-MM-dd HH:mm:ss"),
        incidentStatus: "Resolved",
      });
    }

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/incidents`, data)
      .then(function (response) {
        if (response.status === 201) {
          !isSubmitting && toast.success("Incident successfully added");
          router.push("/incidents");
        } else {
          toast.error(`Error Code: ${response.status}`);
        }
      })
      .catch(function (error) {
        toast.error(error);
      });
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Incident Report - Add New Incident</title>
        </Head>
        {/* Page title & actions */}
        <PageHeader title="Create New Incident"></PageHeader>
        <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3 relative">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {/* Section Incident Detail */}
            <section aria-labelledby="create-new-incident">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Card Start */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg static">
                  <div className="border-gray-200 px-4 py-5 sm:px-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-6">
                        <Input
                          name="incidentName"
                          register={register}
                          required="This is required"
                          label="Incident Name"
                          placeholder="Say what's happening. Example: Login page BRImo error"
                          className={
                            errors.incidentName
                              ? "border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 "
                              : "focus:ring-blue-500 focus:border-blue-500"
                          }
                        />
                        {errors.incidentName && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.incidentName.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Application
                        </label>
                        <Controller
                          name="idApps"
                          control={control}
                          rules={{ required: "This is required" }}
                          render={({ field }) => (
                            <AsyncSelect
                              {...field}
                              isClearable
                              loadOptions={loadApplications}
                              styles={styledReactSelect}
                              className="text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Type an Application"
                            />
                          )}
                        />
                        {errors.idApps && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.idApps.message}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-3"></div>
                      <div className="col-span-6 sm:col-span-3">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Log Start
                        </label>
                        <Controller
                          control={control}
                          rules={{ required: "This is required" }}
                          name="logStartTime"
                          render={({ field }) => (
                            <DatePicker
                              allowClear
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
                      <div className="col-span-6 sm:col-span-3">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Start Time
                        </label>
                        <Controller
                          control={control}
                          rules={{ required: "This is required" }}
                          name="startTime"
                          render={({ field }) => (
                            <DatePicker
                              allowClear
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
                        {errors.startTime && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.startTime.message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-3 col-span-6 sm:col-span-6">
                        <Switch
                          checked={enabled}
                          onChange={handleSwitch}
                          className={classNames(
                            enabled ? "bg-blue-600" : "bg-gray-200",
                            "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          )}
                        >
                          <span className="sr-only">Use setting</span>
                          <span
                            aria-hidden="true"
                            className={classNames(
                              enabled ? "translate-x-5" : "translate-x-0",
                              "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                            )}
                          />
                        </Switch>
                        <div>
                          <label className="block text-sm font-regular text-gray-700">
                            Is the incident over ?
                          </label>
                          <span className="inline-block align-top text-xs text-gray-400">
                            Please switch the toggle if the incident is over
                          </span>
                        </div>
                      </div>
                      {/* Jika kondisi incident sudah selesai */}
                      {enabled === true && (
                        <>
                          <div className="col-span-6 sm:col-span-3">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
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
                          <div className="col-span-6 sm:col-span-3">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
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
                                  options={urgencyOptions}
                                  styles={styledReactSelect}
                                  className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                            />
                            {errors.idUrgency && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.idUrgency.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
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
                                  options={impactOptions}
                                  styles={styledReactSelect}
                                  className="text-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                              )}
                            />
                            {errors.idImpact && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.idImpact.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Impacted System
                            </label>
                            <textarea
                              {...register("impactedSystem", {
                                required: "This is required",
                              })}
                              id="impactedSystem"
                              name="impactedSystem"
                              rows={3}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Describe the systems affected by the incident"
                              defaultValue={""}
                            />
                            {errors.impactedSystem && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.impactedSystem.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Root Cause
                            </label>
                            <textarea
                              {...register("rootCause", {
                                required: "This is required",
                              })}
                              id="rootCause"
                              name="rootCause"
                              rows={3}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Write a good Root Cause Analysis (RCA)"
                            />
                            {errors.rootCause && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.rootCause.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Action Items
                            </label>
                            <textarea
                              {...register("actionItem", {
                                required: "This is required",
                              })}
                              id="actionItem"
                              name="actionItem"
                              rows={3}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Describe the action"
                            />
                            {errors.actionItem && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.actionItem.message}
                              </p>
                            )}
                          </div>
                          <div className="col-span-6 sm:col-span-6">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Responsible Engineer
                            </label>
                            <textarea
                              {...register("responsibleEngineer", {
                                required: "This is required",
                              })}
                              id="responsibleEngineer"
                              name="responsibleEngineer"
                              rows={3}
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                              placeholder="Mention the engineer team. Example : SDK, CAO, etc."
                            />
                            {errors.responsibleEngineer && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.responsibleEngineer.message}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
                    <ButtonSmall
                      type="submit"
                      className={
                        isSubmitting
                          ? "disabled:opacity-50 cursor-not-allowed"
                          : ""
                      }
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Spinner />}
                      Save
                    </ButtonSmall>
                    <ButtonSecondary
                      onClick={() => {
                        reset(defaultValues);
                      }}
                    >
                      Reset
                    </ButtonSecondary>
                  </div>
                </div>
              </form>
            </section>
          </div>

          {/* Start Docs Panel */}
          <section
            aria-labelledby="docs-title"
            className="lg:col-start-3 lg:col-span-1"
          >
            <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
              <h2
                id="timeline-title"
                className="text-lg font-medium text-gray-900 inline-flex items-center"
              >
                <QuestionMarkCircleIcon
                  className="-ml-1 mr-2 h-6 w-6 text-blue-500"
                  aria-hidden="true"
                />
                Docs
              </h2>
              <dl className="space-y-3 divide-y divide-gray-200">
                {docs.map((doc) => (
                  <Disclosure as="div" key={doc.id} className="pt-3">
                    {({ open }) => (
                      <>
                        <dt className="text-lg">
                          <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400 text-base">
                            <span className="font-normal text-base text-gray-900">
                              {doc.title}
                            </span>
                            <span className="ml-6 h-7 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? "-rotate-180" : "rotate-0",
                                  "h-6 w-6 transform"
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </dt>
                        <Disclosure.Panel as="dd" className="mt-2 pr-12">
                          <p className="text-sm font-medium text-gray-900">
                            {doc.bodyHeader}
                          </p>
                          <ul className="list-disc list-inside text-gray-500 text-sm">
                            {doc.bodyContent.map((bc) => (
                              <li key={bc.id}>{bc.text}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </dl>
            </div>
          </section>
          {/* End of Docs Panel */}
        </div>
      </Layout>
    </>
  );
}

export default addIncident;
