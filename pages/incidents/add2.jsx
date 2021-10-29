import { useState } from "react";
import Head from "next/head";
import Layout from "../../components/layout";
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon, MailIcon } from '@heroicons/react/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { classNames, styledReactSelect } from "../../components/utils";
import { Input } from "../../components/ui/forms";
import { Controller, useForm, } from 'react-hook-form';
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../../components/incidents/page-header";
import docs from "../../components/incidents/docs.json"

const app = [
    { value: 1, label: "Brinets Web" },
    { value: 2, label: "Proswitching JCB" },
    { value: 3, label: "BI-ETP (BI-Electronic Trading Platform)" }
];

function addIncident() {
    const { register, handleSubmit, control, setError, formState: { errors } } = useForm();
    console.log(errors);

    const onSubmit = (data) => {
        const result = Object.assign(data, { idApps: data.idApps.value, idUrgency: data.idUrgency.value })
        console.log(result);
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>Incident Report - Add New Incident</title>
                </Head>
                {/* Page title & actions */}
                <PageHeader title="Create New Incident" />

                <div className="mt-8 max-w-full mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-full lg:px-12 lg:grid-flow-col-dense lg:grid-cols-3">
                    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
                        {/* Section Incident Detail */}
                        <section aria-labelledby="create-new-incident">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Card Start */}
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="border-gray-200 px-4 py-5 sm:px-6">
                                        <div className="grid grid-cols-6 gap-6">
                                            <div className="col-span-6 sm:col-span-6">
                                                <Input
                                                    name="incidentName"
                                                    register={register}
                                                    required="This is required"
                                                    label="Incident Name"
                                                    placeholder="Say what's happening. Example: Login page BRImo error"
                                                    className={errors.incidentName ? 'border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 ' : 'focus:ring-blue-500 focus:border-blue-500'}
                                                />
                                                {errors.incidentName && <p className="mt-2 text-sm text-red-600">{errors.incidentName.message}</p>}
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Application</label>
                                                <Controller
                                                    name="idApps"
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            {...field}
                                                            options={app}
                                                            styles={styledReactSelect}
                                                            className="text-sm"
                                                        />
                                                    )}
                                                />
                                                {errors.idApps && <p className="mt-2 text-sm text-red-600">{errors.idApps.message}</p>}
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Urgency</label>
                                                <Controller
                                                    name="idUrgency"
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    render={({ field }) => (
                                                        <Select
                                                            isClearable
                                                            {...field}
                                                            options={[
                                                                { value: 1, label: "Low" },
                                                                { value: 2, label: "High" },
                                                                { value: 3, label: "Medium" }
                                                            ]}
                                                            styles={styledReactSelect}
                                                            className="text-sm"
                                                            rules={{ required: "This is required" }}
                                                        />
                                                    )}
                                                />
                                                {errors.idUrgency && <p className="mt-2 text-sm text-red-600">{errors.idUrgency.message}</p>}
                                            </div>
                                            <div className="col-span-6 sm:col-span-3">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                                <Controller
                                                    control={control}
                                                    name="startTime"
                                                    render={({ field }) => (
                                                        <ReactDatePicker
                                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                            placeholderText="Select date"
                                                            onChange={(e) => field.onChange(e)}
                                                            selected={field.value}
                                                        />
                                                    )}
                                                />
                                            </div>
                                            <div className="col-span-6 sm:col-span-6">
                                                <Input
                                                    name="impactedSystem"
                                                    register={register}
                                                    required="This is required"
                                                    label="Impacted System"
                                                    placeholder="Describe impact of the incident"
                                                    className={errors.impactedSystem ? 'border-red-300 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 ' : 'focus:ring-blue-500 focus:border-blue-500'}
                                                />
                                                {errors.impactedSystem && <p className="mt-2 text-sm text-red-600">{errors.impactedSystem.message}</p>}
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <div className="mt-1 relative rounded-md shadow-sm">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <MailIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        id="email"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                                                        placeholder="you@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                        <button
                                            type="submit"
                                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Start Docs Panel */}
                    <section aria-labelledby="docs-title" className="lg:col-start-3 lg:col-span-1">
                        <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
                            <h2 id="timeline-title" className="text-lg font-medium text-gray-900 inline-flex items-center">
                                <QuestionMarkCircleIcon className="-ml-1 mr-2 h-6 w-6 text-blue-500" aria-hidden="true" />
                                Docs
                            </h2>
                            <dl className="space-y-3 divide-y divide-gray-200">
                                {docs.map((doc) => (
                                    <Disclosure as="div" key={doc.id} className="pt-3">
                                        {({ open }) => (
                                            <>
                                                <dt className="text-lg">
                                                    <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400 text-base">
                                                        <span className="font-normal text-base text-gray-900">{doc.title}</span>
                                                        <span className="ml-6 h-7 flex items-center">
                                                            <ChevronDownIcon
                                                                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Disclosure.Button>
                                                </dt>
                                                <Disclosure.Panel as="dd" className="mt-2 pr-12">
                                                    <p className="text-sm font-medium text-gray-900">{doc.bodyHeader}</p>
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
