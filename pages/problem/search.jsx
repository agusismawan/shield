import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { useRouter } from "next/router";
import withSession from "lib/session";
import { async } from "regenerator-runtime";
import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import { SearchIcon, CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";
import { format } from "date-fns";
import { Spin, Alert } from "antd";
import { PrimaryAnchorButton as Button } from "components/ui/button/primary-anchor-button";
import { Input } from "antd";

export const getServerSideProps = withSession(async function ({ req, query }) {
  const user = req.session.get("user");
  if (!user) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  let url = new URL(
    `${process.env.NEXT_PUBLIC_API_PROBMAN}/problem/matching/search`
  );
  const paramLength = Object.keys(query).length;

  if (paramLength > 0) {
    if (query.q && paramLength === 1) {
      url.searchParams.append("q", query.q);
    } else if (paramLength === 2) {
      if (query.q && query.perPage) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", 1);
        url.searchParams.append("perPage", query.perPage);
      } else if (query.q && query.page) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", 1);
      }
    } else if (paramLength === 3) {
      if (query.q && query.page && query.perPage) {
        url.searchParams.append("q", query.q);
        url.searchParams.append("page", 1);
        url.searchParams.append("perPage", query.perPage);
      }
    } else {
      return false;
    }
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${user.accessToken}` },
  });
  const data = await res.json();

  if (data) {
    return {
      props: {
        user: user,
        data: data,
      },
    };
  }
});

const ProblemSearch = ({ data, user }) => {
  const [isLoading, setLoading] = useState(false);
  const [selectedPage, setSelectedPage] = useState("");
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);
  const router = useRouter();
  const PER_PAGE = 5;

  // Handle on enter search
  const onSearch = (e) => {
    const keyword = e.target.value;
    if (e.key === "Enter" && keyword) {
      e.preventDefault();
      const currentPath = router.pathname;
      router.push({
        pathname: currentPath,
        query: { q: keyword, perPage: PER_PAGE },
      });
    }
  };

  let content = null;
  if (isLoading)
    content = (
      <>
        <div className="relative mx-auto">
          <div className="relative">
            <Spin size="large" tip="Loading..." />
          </div>
        </div>
      </>
    );
  else {
    content = (
      <>
        <ul className="divide-y divide-gray-200">
          {data.data.rows.map((result) => (
            <li
              key={result.idproblem}
              className="relative bg-white sm:rounded-lg py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
            >
              <div className="flex justify-between space-x-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/incidents/${result.idproblem}`}>
                    <a href="#" className="block focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-bold text-gray-900">
                        {result.incidentName == null
                          ? "Masih Kosong"
                          : result.incidentName}
                      </p>
                      <div className="mt-1 flex space-x-4">
                        <p className="flex items-center text-sm text-gray-500 truncate">
                          <CodeIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                            aria-hidden="true"
                          />{" "}
                          {result.problemApp}
                        </p>
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {result.paramIncidentType
                            ? result.paramIncidentType.incidentType
                            : "Gaada Incident Type"}
                        </p>
                        <p
                          className={classNames(
                            result.incidentStatus === "Open"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800",
                            "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          )}
                        >
                          {result.incidentStatus == null
                            ? "Dia Null"
                            : result.incidentStatus}
                        </p>
                      </div>
                    </a>
                  </Link>
                </div>
                <time
                  dateTime={result.problemCreatedAt}
                  className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                >
                  {result.problemCreatedAt}
                </time>
              </div>
              <div className="mt-4">
                <p className="line-clamp-2 text-sm text-gray-600 truncate">
                  Impacted System :{" "}
                  {result.problemImpactedSystem != null
                    ? result.problemImpactedSystem
                    : "Dia Null"}
                </p>
                <p className="line-clamp-2 text-sm text-gray-600 truncate">
                  Root Cause :{" "}
                  {result.problemRootCause != null
                    ? result.problemRootCause
                    : "Dia Null"}
                </p>
                <p className="line-clamp-2 text-sm text-gray-600 truncate">
                  Action :{" "}
                  {result.problemResolution != null
                    ? result.problemResolution
                    : "Dia Null"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Problem Search</title>
        </Head>
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search problem ticket
                    </label>
                    <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                        <SearchIcon
                          className="flex-shrink-0 h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        name="search"
                        id="search-field"
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search problem name, root cause &amp; action"
                        type="search"
                        onKeyPress={onSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </header> */}

          <div className="mt-10 mb-5 max-w-full sm:px-6 lg:max-w-full lg:px-12">
            <div className="flex gap-x-2">
              <div className="flex-auto">
                <label
                  htmlFor="search"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Search
                </label>
                <form action="#" method="GET">
                  <Input
                    onKeyPress={onSearch}
                    disabled={false}
                    allowClear
                    placeholder="Search problem name, root cause &amp; action"
                    prefix={
                      <SearchIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    }
                    style={{
                      borderRadius: "0.375rem",
                      height: "38px",
                    }}
                  />
                </form>
              </div>
            </div>
            {/* Pengecekan untuk landing pa */}
            {/* {props.search === 400 ? (
              <>
                <Alert
                  message="This page is specifically for searches related to problem name, root causes and actions of incidents. Please type a word related to these three things"
                  type="info"
                  showIcon
                  style={{ borderRadius: "0.375rem" }}
                />
                <div className="relative mx-auto">
                  <div className="relative">
                    <img
                      className="mx-auto w-2/5"
                      src="/search-engines-rafiki.svg"
                      alt="Workcation"
                    />
                    <div className="-mt-12 mb-3 max-w-3xl mx-auto text-center">
                      <Link href="/incidents" passHref>
                        <Button>Back to incident menu</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : props.search !== 400 && props.search.length === 0 ? (
              <div className="relative mx-auto">
                <div className="relative">
                  <img
                    className="mx-auto w-2/5"
                    src="/nodata-rafiki.svg"
                    alt="Workcation"
                  />
                  <div className="-mt-16 mb-3 max-w-3xl mx-auto text-center leading-9">
                    <p className="text-2xl font-bold text-gray-900">
                      Oops, Incident not found
                    </p>
                    <p className="mb-3">
                      Try another keyword or back to incident menu
                    </p>
                    <Link
                      href={{
                        pathname: "search",
                      }}
                      passHref
                    >
                      <Button>Back to incident menu</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <> */}
            {content}
            {/* <div className="mt-3 hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">{props.currentPage}</span>{" "}
                      to <span className="font-medium">{props.pageCount}</span>{" "}
                      of <span className="font-medium">{props.totalCount}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <ReactPaginate
                      initialPage={props.currentPage - 1}
                      pageCount={props.pageCount} //page count
                      previousLabel={"Prev"}
                      onPageChange={paginationHandler}
                      containerClassName={
                        "relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      }
                      pageLinkClassName={
                        "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      }
                      previousLinkClassName={
                        "relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      }
                      nextLinkClassName={
                        "relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      }
                      breakLabel={"..."}
                      breakLinkClassName={
                        "bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      }
                      activeLinkClassName={
                        "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                      }
                    />
                  </div>
                </div> */}
            {/* </>
            )} */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ProblemSearch;
