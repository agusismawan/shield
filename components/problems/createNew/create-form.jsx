import { useState, useEffect } from "react";
import axios from "axios";
import SelectFilterApps from "./select-filter-apps";
import SelectFilterIncidents from "./select-filter-incidents";
import { ExclamationIcon } from "@heroicons/react/outline";
import { Switch } from "@headlessui/react";
import {
  classNames,
  styledReactSelect,
  styledReactSelectAdd,
} from "../../utils";
import { Controller, useForm } from "react-hook-form";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import withSession from "lib/session";
import { useRouter } from "next/router";
import format from "date-fns/format";

const CreateForm = (user) => {
  const {
    register,
    unregister,
    handleSubmit,
    control,
    formState,
    reset,
    getValues,
    setValue,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
  });

  const arrSource = [
    { id: 1, source: "IM" },
    { id: 2, source: "Incident Berulang" },
    { id: 3, source: "HC" },
    { id: 4, source: "PROACTIVE" },
    { id: 5, source: "DEEP" },
  ];

  const { errors, isSubmitting } = formState;
  const [enabled, setEnabled] = useState(false);
  const [typeOptions, setTypeOptions] = useState([]);
  const [sourceOptions, setSourceOptions] = useState([]);
  const [urgencyOptions, setUrgencyOptions] = useState([]);
  const [impactOptions, setImpactOptions] = useState([]);
  const router = useRouter();

  // Handle switch button when problem from incident
  const handleSwitch = () => {
    if (enabled) {
      setEnabled(false);
    } else {
      setEnabled(true);
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

  // Get data type
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

  // Get data type
  useEffect(() => {
    axios
      .get("http://127.0.0.1:3030/v1/probman/source/all")
      .then((response) => {
        const data = response.data.data.map((d) => ({
          value: d.id,
          label: d.label,
        }));
        setSourceOptions(data);
      })
      .catch((err) => toast.error(`Type ${err}`));
  }, []);

  const createProblem = async (event, user) => {
    event.preventDefault();

    let valIncident;
    if (enabled === false) {
      valIncident = null;
    } else {
      valIncident = event.target.idIncident.value;
    }
    const postProblem = await fetch(
      "http://127.0.0.1:3030/v1/probman/problem/create",
      {
        body: JSON.stringify({
          idType: parseInt(event.target.idType.value),
          idApps: parseInt(event.target.idApps.value),
          idImpact: parseInt(event.target.idImpact.value),
          idUrgency: parseInt(event.target.idUrgency.value),

          // hardcode
          idPriorityMatrix: Math.floor(Math.random() * (8 - 1 + 1)) + 1,

          problemName: event.target.problemName.value,
          problemNumber: event.target.problemNumber.value,
          sourceProblem: event.target.selectSource.value,
          status: "Draft",
          followUp: "Not Yet",
          updatedBy: Math.floor(Math.random() * (42 - 1 + 1)) + 1,
          idIncident: parseInt(valIncident),
          cekIncident: enabled,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6dHJ1ZSwiaWF0IjoxNjQ1NTE4MjQ4LCJqdGkiOiI4OTdhNTVhMy1kNDhjLTRkNjYtOWY1ZC0yNzczNTU5MGM0YzIiLCJ0eXBlIjoiYWNjZXNzIiwic3ViIjo2MiwibmJmIjoxNjQ1NTE4MjQ4LCJleHAiOjE2NDU5NTAyNDgsIm1hdHJpeElkIjo0LCJtYXRyaXhEZXBhcnRtZW50IjoyLCJtYXRyaXhHcm91cCI6MiwibWF0cml4R3JhbnQiOiJ2aWV3ZXIifQ.uuV4tlKLQvwmA3N4TRA0hDDKj90MPjTwDl531-s9-bY`,
        },
        method: "POST",
      }
    )
      .then((response) => {
        if (response.status === 201) {
          toast.success("Incident successfully updated");
          router.push("/problem");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <div className="max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-0 lg:max-w-full lg:px-0 lg:grid-flow-col-dense lg:grid-cols-3">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <section
            aria-labelledby="create-problem"
            className="space-y-6 lg:col-start-1 lg:col-span-2"
          >
            <form onSubmit={createProblem}>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg static">
                <div className="mt-6 px-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Problem Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="problemName"
                      name="problemName"
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      type="text"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Write a few sentences about problem.
                  </p>
                </div>

                <div className="grid grid-cols-6 gap-6 mt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Application
                    </label>
                    <div className="mt-1 block rounded-md shadow-sm">
                      {/* ini nanti diganti dengan controller */}
                      <SelectFilterApps />
                    </div>
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Problem Number
                    </label>
                    <div className="mt-1">
                      <input
                        id="problemNumber"
                        name="problemNumber"
                        disabled={true}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                        value={`PR-**-${format(new Date(), "MMyyyy")}`}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Generate a number for problem definied.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-6 mt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="mt-1">
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
                        <p className="mt-2 text-sm text-red-600">
                          {errors.idType.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Source
                    </label>
                    <div className="mt-1">
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
                        <p className="mt-2 text-sm text-red-600">
                          {errors.idSource.message}
                        </p>
                      )}
                      {/* <select
                        name="selectSource"
                        id="selectSource"
                        className="text-sm focus:ring-blue-500 focus:border-blue-500"
                      >
                        {arrSource.map((item) => (
                          <option
                            key={`opt-${item.source}`}
                            value={item.source}
                          >
                            {item.source}
                          </option>
                        ))}
                      </select> */}
                    </div>
                  </div>
                </div>

                {/* Toggle Insiden */}
                {/* <div className="mt-6 px-6">
                  <Switch.Group as="div" className="flex items-center">
                    <Switch
                      checked={enabled}
                      onChange={handleSwitch}
                      className={classNames(
                        enabled ? "bg-blue-600" : "bg-gray-200",
                        "relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          enabled ? "translate-x-5" : "translate-x-0",
                          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                        )}
                      />
                    </Switch>
                    <Switch.Label as="span" className="ml-3" passive>
                      <span className="text-sm font-medium text-gray-900">
                        From Incident{" "}
                      </span>
                      <span className="text-sm text-gray-500">
                        (Switch the toggle if the problem from incident)
                      </span>
                    </Switch.Label>
                  </Switch.Group>
                </div> */}
                {/* JIka Insiden Enabled */}
                {/* {enabled === true && (
                  <>
                    <div className="mt-6 px-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Incident
                      </label>
                      <div className="mt-1 block rounded-md shadow-sm">
                        <SelectFilterIncidents />
                      </div>
                    </div>
                  </>
                )} */}
                {/* End of Toggle Insiden */}

                <div className="grid grid-cols-6 gap-6 mt-6 px-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Urgency
                    </label>
                    <div className="mt-1">
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
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Impact
                    </label>
                    <div className="mt-1">
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
                  </div>
                </div>

                <div className="my-3 pr-6">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
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
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Create New Problem
                </h3>
                <div className="mt-2">
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
