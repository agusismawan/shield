import Head from "next/head"
import Layout from "../../components/layout"
import { Fragment, useRef, useState } from "react"
import { DocumentTextIcon, CalendarIcon } from "@heroicons/react/solid"
import { ExclamationIcon } from "@heroicons/react/outline"
import { Dialog, Transition } from "@headlessui/react"
import format from "date-fns/format"
import withSession from "lib/session"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function ProblemDetail({ user, problem }) {
  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  return (
    <>
      <Layout key="LayoutProblemDetail" session={user}>
        <Head>
          <title>Problem Detail</title>
        </Head>
        <section>
          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              static
              className="fixed z-10 inset-0 overflow-y-auto"
              initialFocus={cancelButtonRef}
              open={open}
              onClose={setOpen}
            >
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                {/* This element is to trick the browser into centering the modal contents. */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg leading-6 font-medium text-gray-900"
                          >
                            Deactivate Problem
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to deactivate your problem?
                              All of your data will be permanently removed. This
                              action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <div className="py-6">
            <div className="max-w-full mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-full lg:px-12">
              <div className="flex items-center space-x-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Problem Detail - {problem.data.id}
                  </h1>
                  <p className="text-sm font-medium text-gray-500">
                    Created by&nbsp;
                    <a href="#" className="text-gray-900">
                      {problem.data.user.fullName
                        ? problem.data.user.fullName
                        : problem.data.user.userName}
                    </a>{" "}
                    on{" "}
                    <time dateTime={format(new Date(problem.data.createdAt), "d LLLL yyyy hh:mm")}>
                      {format(new Date(problem.data.createdAt), "d LLLL yyyy hh:mm")}
                    </time>
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
                <span
                  className={classNames(
                    problem.data.status == "Draft"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800",
                    "inline-flex items-center justify-center px-3 py-0.5 rounded-full text-sm font-medium"
                  )}
                >
                  {problem.data.status}
                </span>
                <span className="sm:ml-3">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setOpen(true)}
                  >
                    <DocumentTextIcon
                      className="-ml-1 mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    Edit
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
                        {problem.data.problemName}
                      </h2>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Application
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.app.subName
                              ? problem.data.app.subName
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-500">
                            Incident Priority
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.priorityMatrix.mapping
                              ? problem.data.priorityMatrix.mapping
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Workaround
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.rootCause.workAround
                              ? problem.data.rootCause.workAround
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Impact
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.rootCause.impact
                              ? problem.data.rootCause.impact
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Urgency
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.app.criticalityApp
                              ? problem.data.app.criticalityApp
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Root Cause
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.rootCause.description
                              ? problem.data.rootCause.description
                              : "Not defined yet"}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Action
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {problem.data.rootCause.resolution
                              ? problem.data.rootCause.resolution
                              : "Not defined yet"}
                          </dd>
                        </div>
                      </dl>
                    </div>
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
                              belom di set
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
                        Started on {problem.startTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon
                        className="h-5 w-5 text-emerald-600"
                        aria-hidden="true"
                      />
                      <span className="text-gray-900 text-sm">
                        Resolved on {problem.updatedAt}
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

export default ProblemDetail

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
  )
  const data = await res.json()
  return {
    props: {
      user: user,
      problem: data,
    },
  }
})