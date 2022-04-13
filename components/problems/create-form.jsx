import { useState, useEffect } from "react";
import axios from "axios";
import { ExclamationIcon } from "@heroicons/react/outline";
import { styledReactSelect, styledReactSelectAdd } from "../utils";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import { Spinner } from "components/ui/spinner";
import { useRouter } from "next/router";
import format from "date-fns/format";
import AsyncSelect from "react-select/async";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const CreateForm = ({ user }) => {
  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState,
    getValues,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  const { errors, isSubmitting } = formState;
  const [enabled, setEnabled] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const [followupOptions, setFollowupOptions] = useState([]);
  const router = useRouter();

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

  const handleAppChange = (event) => {
    if (event == null) {
      setApps("");
    } else {
      setApps(event.value);
    }
  };

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

  // Get data Impact
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

  // Get data Type
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3030/v1/probman/type/all")
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.type,
        }));
        setTypeOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Source Problem
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3030/v1/probman/source/all")
      .then((response) => {
        const data = response.data.data
          .filter((value) => {
            return !value.label.startsWith("Incident");
          })
          .map((d) => ({
            value: d.id,
            label: d.label,
          }));
        setSourceOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Get data Follow Up Plan
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3030/v1/probman/followup/all")
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setFollowupOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  // Ini dilakukan saat onSubmit
  const createProblem = async (data, event) => {
    event.preventDefault();
    let checkFollowup = null;
    if (event.target.idFollowup.value !== null) {
      checkFollowup = parseInt(event.target.idFollowup.value);
    } else if (event.target.idFollowup.value === null) {
      checkFollowup = 4;
    }
    Object.assign(data, {
      problemName: event.target.problemName.value,
      jiraProblem: event.target.jiraProblem.value,
      idApps: data.idApps.value,
      idType: parseInt(event.target.idType.value),
      idSource: parseInt(event.target.idSource.value),
      idUrgency: parseInt(event.target.idUrgency.value),
      idImpact: parseInt(event.target.idImpact.value),
      idFollowup: checkFollowup,
      assignedTo: user.id,
      createdBy: user.id,
      updatedBy: user.id,
    });

    setSpinner(true);
    axios
      .post(`http://127.0.0.1:3030/v1/probman/problem/create`, data, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then(function (response) {
        if (response.status === 201 || postProblem) {
          toast.success("Problem Sucessfully Created");
          setTimeout(() => router.push("/problem/list"), 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          toast.error(
            `${error.response.data.message} (Code: ${error.response.status})`
          );
        } else if (error.request) {
          setSpinner(false);
          toast.error(`Request: ${error.request}`);
        } else {
          setSpinner(false);
          toast.error(`Message: ${error.message}`);
        }
      });
  };

  const [apps, setApps] = useState("");

  return (
    <>
      <div className="max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-0 lg:max-w-full lg:px-0 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <section
            aria-labelledby="create-problem"
            className="space-y-6 lg:col-start-1 lg:col-span-2"
          >
            <form onSubmit={handleSubmit(createProblem)}>
              <div className="bg-white shadow overflow-visible sm:rounded-lg static">
                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Problem Name
                  </label>
                  <div className="pt-1">
                    {/* <input
                      id="problemName"
                      name="problemName"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      type="text"
                      required
                    /> */}
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
                    />
                    {errors.problemName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.problemName.message}
                      </p>
                    )}
                  </div>
                  <p className="pt-2 text-sm text-gray-500">
                    Write a few sentences about problem.
                  </p>
                </div>

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Link JIRA
                  </label>
                  <div className="pt-1">
                    <input
                      id="jiraProblem"
                      name="jiraProblem"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
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
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Problem Number
                    </label>
                    <div className="pt-1">
                      <input
                        id="problemNumber"
                        name="problemNumber"
                        disabled={true}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                        value={`PR-**-${format(new Date(), "MMyyyy")}`}
                      />
                    </div>
                    <p className="pt-2 text-sm text-gray-500">
                      Generate a number for problem definied.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 pt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="pt-1">
                      <Controller
                        name="idType"
                        control={control}
                        rules={{ required: "This is required" }}
                        render={({ field }) => (
                          <Select
                            {...field}
                            isClearable
                            options={typeOptions}
                            styles={styledReactSelect}
                            className="text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        )}
                      />
                      {errors.idType && (
                        <p className="pt-2 text-sm text-red-600">
                          {errors.idType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
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
                </div>

                <div className="pt-6 px-6">
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

                <div className="pt-6 px-6">
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
                          options={impactOptions}
                          styles={styledReactSelect}
                          className="text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      )}
                    />
                    {errors.idImpact && (
                      <p className="pt-2 text-sm text-red-600">
                        {errors.idImpact.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Follow Up Plan
                  </label>
                  <div className="pt-1">
                    <Controller
                      name="idFollowup"
                      control={control}
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

                <div className="py-6 pr-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="mr-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={classNames(
                        spinner
                          ? "px-4 disabled:opacity-50 cursor-not-allowed"
                          : null,
                        "ml-1 pl-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      )}
                      disabled={spinner}
                    >
                      {spinner && <Spinner />}
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </div>

        <section
          aria-labelledby="problem-docs"
          className="lg:col-start-3 lg:col-span-1"
        >
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationIcon
                  className="h-6 w-6 text-red-600"
                  aria-hidden="true"
                />
              </div>
              <div className="pt-3 text-center sm:pt-0 sm:pl-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Problem
                </h3>
                <div className="pt-2">
                  <p className="text-sm text-gray-500">
                    <b>
                      Are all of Problem&#39;s requirements already prepared?
                    </b>
                    <ul className="pl-5 list-disc">
                      <li>Have or haven&#39;t Incident</li>
                      <li>Category</li>
                      <li>Related Groups</li>
                      <li>Known Error / Root Cause</li>
                      <li>Project Goals (Tujuan Perbaikan)</li>
                      <li>Impacted Application / System / Features</li>
                      <li>
                        Proposed Improvement / Enhancement (Usulan Perbaikan)
                      </li>
                    </ul>
                  </p>
                  <br />
                  <p className="text-sm text-gray-500">
                    <i>
                      <b>
                        If all data are prepared, you can get IPR&#39;s number
                        after data submission.
                      </b>
                      <br />
                      Otherwise, the IPR&#39;s number will be generated after
                      the problem has been analyzed.
                    </i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default CreateForm;
