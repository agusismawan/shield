import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Disclosure, Switch } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { classNames, styledReactSelect } from "../../components/utils";
import { Input } from "../../components/ui/forms";
import { Controller, useForm, } from 'react-hook-form';
import Select from "react-select";
import DatePicker from "react-datepicker";
import format from "date-fns/format";
import "react-datepicker/dist/react-datepicker.css";
import PageHeader from "../../components/incidents/page-header";
import { ButtonSmall, ButtonSecondary } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import docs from "../../components/incidents/docs.json"
import { toast } from 'react-toastify';

const app = [
    { value: 1, label: "Brinets Web" },
    { value: 2, label: "Proswitching JCB" },
    { value: 3, label: "BI-ETP (BI-Electronic Trading Platform)" }
];

function addIncident() {
    const defaultValues = {
        incidentName: "",
        idApps: "",
        idUrgency: "",
        startTime: "",
        impactedSystem: ""
    }

    const { register, handleSubmit, control, formState, reset } = useForm({ defaultValues });
    const { errors, isSubmitting } = formState;
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const router = useRouter();
    const [enabled, setEnabled] = useState(false);
    console.log(router);
    console.log(enabled);

    console.log(errors);


    const onSubmit = async (data, e) => {
        e.preventDefault();
        await sleep(500);
        const formData = Object.assign(data, { idApps: data.idApps.value, idUrgency: data.idUrgency.value })
        formData["startTime"] = format(new Date(formData.startTime), 'yyyy-MM-dd HH:mm:ss');
        console.log(formData);

        const res = 201;
        if (res === 201) {
            !isSubmitting && toast.success("Incident successfully added");

            await sleep(3000);
            router.push('/');
        } else {
            toast.error("Warning: Invalid DOM property `stroke-width`.");
        }
    }

    return (
        <>
            <Layout>
                <Head>
                    <title>Incident Report - Add New Incident</title>
                </Head>
                {/* Page title & actions */}
                <PageHeader title="Create New Incident" />
                {/* <ToastContainer /> */}
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
                                                            placeholder="Select Apps..."
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
                                                            placeholder="Select Urgency..."
                                                        />
                                                    )}
                                                />
                                                {errors.idUrgency && <p className="mt-2 text-sm text-red-600">{errors.idUrgency.message}</p>}
                                            </div>
                                            <div className="col-span-6 sm:col-span-2">
                                                <label className="mb-1 block text-sm font-medium text-gray-700">Start Time</label>
                                                <Controller
                                                    control={control}
                                                    rules={{ required: "This is required" }}
                                                    name="startTime"
                                                    render={({ field }) => (
                                                        <DatePicker
                                                            className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            placeholderText="Select date"
                                                            onChange={(e) => field.onChange(e)}
                                                            selected={field.value}
                                                            isClearable
                                                            showTimeSelect
                                                            // dateFormat="yyyy-MM-dd HH:mm"
                                                            dateFormat="d MMMM yyyy HH:mm"
                                                            timeFormat="HH:mm"
                                                        />
                                                    )}
                                                />
                                                {errors.startTime && <p className="mt-2 text-sm text-red-600">{errors.startTime.message}</p>}
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
                                            <div className="flex items-center space-x-3 col-span-6 sm:col-span-2">
                                                <Switch
                                                    checked={enabled}
                                                    onChange={setEnabled}
                                                    className={classNames(
                                                        enabled ? 'bg-blue-600' : 'bg-gray-200',
                                                        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                                    )}
                                                >
                                                    <span className="sr-only">Use setting</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            enabled ? 'translate-x-5' : 'translate-x-0',
                                                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200'
                                                        )}
                                                    />
                                                </Switch>
                                                <label className="mb-1 block text-sm font-regular text-gray-700">Is the incident over ?</label>
                                            </div>
                                            {enabled === true &&
                                                <div className="col-span-6 sm:col-span-6">
                                                    <textarea
                                                        id="about"
                                                        name="about"
                                                        rows={3}
                                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                                                        placeholder="you@example.com"
                                                        defaultValue={''}
                                                    />
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
                                        <ButtonSmall
                                            type="submit"
                                            className={isSubmitting ? 'disabled:opacity-50 cursor-not-allowed' : ''}
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <Spinner />}
                                            Save
                                        </ButtonSmall>
                                        <ButtonSecondary
                                            onClick={() => reset()}
                                        >
                                            Reset
                                        </ButtonSecondary>
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
