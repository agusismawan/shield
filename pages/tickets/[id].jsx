import Layout from "components/layout";
import Head from "next/head";
import withSession from "../../lib/session";
import { classNames } from "components/utils";
import { Fragment, useEffect, useState } from "react";
import format from "date-fns/format";
import {
  BellIcon,
  CalendarIcon,
  ChatAltIcon,
  CheckCircleIcon,
  LockOpenIcon,
  LockClosedIcon,
  PencilIcon,
  SearchIcon,
  TagIcon,
  UserCircleIcon as UserCircleIconSolid,
  UserIcon,
  OfficeBuildingIcon,
} from "@heroicons/react/solid";
import activity from "components/tickets/activity.json";

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

  res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tickets/${params.id}/history`,
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
        ticketData: data.ticketData,
        ticketHistoryData: data.ticketHistoryData,
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

export default function ReplyTicket({ user, ticketData, ticketHistoryData }) {
  const [assignees, setAssigneees] = useState();

  useEffect(() => {
    switch (ticketData.escalatedRole) {
      case "0":
        setAssigneees("Operator SDK");
        break;
      case "1":
        setAssigneees("Engineer SDK");
        break;
      case "2":
        setAssigneees("Engineer Bagian Lain");
        break;
      default:
        setAssigneees(ticketData.escalatedRole);
    }
  }, [ticketData.escalatedRole]);

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Reply Ticket - ID {ticketData.id}</title>
        </Head>
        <section>
          <div className="py-8 xl:py-10 bg-white">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
              <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                <div>
                  <div>
                    <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                          Ticket ID #{ticketData.id}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                          Opened by{" "}
                          <a href="#" className="font-medium text-gray-900">
                            {ticketData.picName} - {ticketData.picPN} •{" "}
                            {ticketData.branchName} ({ticketData.branchCode})
                          </a>
                        </p>
                      </div>
                      <div className="mt-4 flex space-x-3 md:mt-0">
                        <button
                          type="button"
                          className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                          <PencilIcon
                            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                    <aside className="mt-8 xl:hidden">
                      <h2 className="sr-only">Details</h2>
                      <div className="space-y-5">
                        <div className="flex items-center space-x-2">
                          {ticketData.ticketStatus == "Open" ? (
                            <>
                              <LockOpenIcon
                                className="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                              <span className="text-red-700 text-sm font-medium">
                                {ticketData.ticketStatus} Issue
                              </span>
                            </>
                          ) : (
                            <>
                              <LockClosedIcon
                                className="h-5 w-5 text-green-500"
                                aria-hidden="true"
                              />
                              <span className="text-green-700 text-sm font-medium">
                                {ticketData.ticketStatus} Issue
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <ChatAltIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-gray-900 text-sm font-medium">
                            {ticketHistoryData.length} reply
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="text-gray-900 text-sm font-medium">
                            Created on{" "}
                            <time>
                              {format(
                                new Date(ticketData.createdAt),
                                "dd MMM yyyy, HH:mm"
                              )}
                            </time>
                          </span>
                        </div>
                      </div>
                      <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Assignees
                          </h2>
                          <ul className="mt-3 space-y-3">
                            <li className="flex justify-start">
                              <a
                                href="#"
                                className="flex items-center space-x-3"
                              >
                                <div className="flex-shrink-0">
                                  <img
                                    className="h-5 w-5 rounded-full"
                                    src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                    alt=""
                                  />
                                </div>
                                <div className="text-sm font-medium text-gray-900">
                                  {assignees}
                                </div>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h2 className="text-sm font-medium text-gray-500">
                            Category
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
                                  {ticketData.idTicketType
                                    ? ticketData.paramTicketType.ticketType
                                    : "None"}
                                </div>
                              </a>{" "}
                            </li>

                            {ticketData.idApps && (
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
                                    {ticketData.paramTicketApps.name}
                                  </div>
                                </a>{" "}
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </aside>
                    <div className="py-3 xl:pt-6 xl:pb-0">
                      <h2 className="sr-only">Description</h2>
                      <div className="prose max-w-none">
                        <p>{ticketData.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <section
                  aria-labelledby="activity-title"
                  className="mt-8 xl:mt-10"
                >
                  <div>
                    <div className="divide-y divide-gray-200">
                      <div className="pb-4">
                        <h2
                          id="activity-title"
                          className="text-lg font-medium text-gray-900"
                        >
                          Activity
                        </h2>
                      </div>
                      <div className="pt-6">
                        {/* Activity feed*/}
                        <div className="flow-root">
                          <ul className="-mb-8">
                            {activity.map((item, itemIdx) => (
                              <li key={item.id}>
                                <div className="relative pb-8">
                                  {itemIdx !== activity.length - 1 ? (
                                    <span
                                      className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                                      aria-hidden="true"
                                    />
                                  ) : null}
                                  <div className="relative flex items-start space-x-3">
                                    {item.type === "comment" ? (
                                      <>
                                        <div className="relative">
                                          <img
                                            className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                                            src={item.imageUrl}
                                            alt=""
                                          />

                                          <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                            <ChatAltIcon
                                              className="h-5 w-5 text-gray-400"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div>
                                            <div className="text-sm">
                                              <a
                                                href={item.person.href}
                                                className="font-medium text-gray-900"
                                              >
                                                {item.person.name}
                                              </a>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                              Replied {item.date}
                                            </p>
                                          </div>
                                          <div className="mt-2 text-sm text-gray-700">
                                            <p>{item.comment}</p>
                                          </div>
                                        </div>
                                      </>
                                    ) : item.type === "assignment" ? (
                                      <>
                                        <div>
                                          <div className="relative px-1">
                                            <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                              <UserCircleIconSolid
                                                className="h-5 w-5 text-gray-500"
                                                aria-hidden="true"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 py-1.5">
                                          <div className="text-sm text-gray-500">
                                            <a
                                              href={item.person.href}
                                              className="font-medium text-gray-900"
                                            >
                                              {item.person.name}
                                            </a>{" "}
                                            assigned{" "}
                                            <a
                                              href={item.assigned.href}
                                              className="font-medium text-gray-900"
                                            >
                                              {item.assigned.name}
                                            </a>{" "}
                                            <span className="whitespace-nowrap">
                                              {item.date}
                                            </span>
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <>
                                        <div>
                                          <div className="relative px-1">
                                            <div className="h-8 w-8 bg-gray-100 rounded-full ring-8 ring-white flex items-center justify-center">
                                              <TagIcon
                                                className="h-5 w-5 text-gray-500"
                                                aria-hidden="true"
                                              />
                                            </div>
                                          </div>
                                        </div>
                                        <div className="min-w-0 flex-1 py-0">
                                          <div className="text-sm leading-8 text-gray-500">
                                            <span className="mr-0.5">
                                              <a
                                                href={item.person.href}
                                                className="font-medium text-gray-900"
                                              >
                                                {item.person.name}
                                              </a>{" "}
                                              added category
                                            </span>{" "}
                                            <span className="mr-0.5">
                                              {item.tags.map((tag) => (
                                                <Fragment key={tag.name}>
                                                  <a
                                                    href={tag.href}
                                                    className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm"
                                                  >
                                                    <span className="absolute flex-shrink-0 flex items-center justify-center">
                                                      <span
                                                        className={classNames(
                                                          tag.color,
                                                          "h-1.5 w-1.5 rounded-full"
                                                        )}
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                    <span className="ml-3.5 font-medium text-gray-900">
                                                      {tag.name}
                                                    </span>
                                                  </a>{" "}
                                                </Fragment>
                                              ))}
                                            </span>
                                            <span className="whitespace-nowrap">
                                              {item.date}
                                            </span>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <div className="flex space-x-3">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <img
                                  className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                                  src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                                  alt=""
                                />

                                <span className="absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px">
                                  <ChatAltIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <form action="#">
                                <div>
                                  <label htmlFor="comment" className="sr-only">
                                    Comment
                                  </label>
                                  <textarea
                                    id="comment"
                                    name="comment"
                                    rows={3}
                                    className="shadow-sm block w-full focus:ring-gray-900 focus:border-gray-900 sm:text-sm border border-gray-300 rounded-md"
                                    placeholder="Reply ticket"
                                    defaultValue={""}
                                  />
                                </div>
                                <div className="mt-6 flex items-center justify-end space-x-4">
                                  <button
                                    type="button"
                                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                  >
                                    <CheckCircleIcon
                                      className="-ml-1 mr-2 h-5 w-5 text-green-500"
                                      aria-hidden="true"
                                    />
                                    <span>Close issue</span>
                                  </button>
                                  <button
                                    type="submit"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
                                  >
                                    Comment
                                  </button>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
              <aside className="hidden xl:block xl:pl-8">
                <h2 className="sr-only">Details</h2>
                <div className="space-y-5">
                  <div className="flex items-center space-x-2">
                    {ticketData.ticketStatus == "Open" ? (
                      <>
                        <LockOpenIcon
                          className="h-5 w-5 text-red-500"
                          aria-hidden="true"
                        />
                        <span className="text-red-700 text-sm font-medium">
                          {ticketData.ticketStatus} Issue
                        </span>
                      </>
                    ) : (
                      <>
                        <LockClosedIcon
                          className="h-5 w-5 text-green-500"
                          aria-hidden="true"
                        />
                        <span className="text-green-700 text-sm font-medium">
                          {ticketData.ticketStatus} Issue
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChatAltIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-gray-900 text-sm font-medium">
                      {ticketHistoryData.length} reply
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-gray-900 text-sm font-medium">
                      Created on{" "}
                      <time>
                        {format(
                          new Date(ticketData.createdAt),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </time>
                    </span>
                  </div>
                </div>
                <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Assignees
                    </h2>
                    <ul className="mt-3 space-y-3">
                      <li className="flex justify-start">
                        <a href="#" className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <img
                              className="h-5 w-5 rounded-full"
                              src="https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80"
                              alt=""
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {assignees}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h2 className="text-sm font-medium text-gray-500">
                      Category
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
                            {ticketData.idTicketType
                              ? ticketData.paramTicketType.ticketType
                              : "None"}
                          </div>
                        </a>{" "}
                      </li>
                      {ticketData.idApps && (
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
                              {ticketData.paramTicketApps.name}
                            </div>
                          </a>{" "}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
