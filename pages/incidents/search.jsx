import Layout from "components/layout";
import Head from "next/head";
import Link from "next/link";
import withSession from "lib/session";
import { useRouter } from "next/router";
import { format } from "date-fns";
import { SearchIcon, CodeIcon } from "@heroicons/react/solid";
import { classNames } from "components/utils";
import { Alert } from "antd";
import { PrimaryAnchorButton as Button } from "components/ui/button/primary-anchor-button";

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

  // search incident data to API
  const queryParam = query.q === undefined ? "" : query.q;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/incidents/search?q=${queryParam}`,
    {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    }
  );
  const data = await res.json();

  console.log(queryParam);

  return {
    props: {
      user: req.session.get("user"),
      search: data,
    },
  };
});

function SearchIncident({ user, search }) {
  const router = useRouter();
  const onSearch = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      router.push(`/incidents/search?q=${e.target.value}`);
    }
  };

  return (
    <>
      <Layout session={user}>
        <Head>
          <title>Incident Search - Shield</title>
        </Head>
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full">
            <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 shadow-sm flex">
              <div className="flex-1 flex justify-between px-4 sm:px-6">
                <div className="flex-1 flex">
                  <form className="w-full flex md:ml-0" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                      Search incident report
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
                        id="incident-search"
                        className="h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:hidden"
                        placeholder="Search incident name, root cause &amp; action"
                        type="search"
                        onKeyPress={onSearch}
                      />
                      <input
                        name="search"
                        id="search-field"
                        className="hidden h-full w-full border-transparent py-2 pl-8 pr-3 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:border-transparent focus:placeholder-gray-400 sm:block"
                        placeholder="Search incident name, root cause &amp; action"
                        type="search"
                        onKeyPress={onSearch}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </header>

          <div className="mt-10 max-w-full sm:px-6 lg:max-w-full lg:px-12">
            {router.asPath === router.pathname && (
              <>
                <Alert
                  message="This page is specifically for searches related to incident name, root causes and actions of incidents. Please type a word related to these three things"
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
            )}
            <ul className="divide-y divide-gray-200">
              {search.data.length === 0 && router.asPath !== router.pathname ? (
                <>
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
                        <Link href="/incidents" passHref>
                          <Button>Back to incident menu</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                search.data.map((result) => (
                  <li
                    key={result.id}
                    className="relative bg-white sm:rounded-lg py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500"
                  >
                    <div className="flex justify-between space-x-3">
                      <div className="min-w-0 flex-1">
                        <Link href={`/incidents/${result.id}`}>
                          <a href="#" className="block focus:outline-none">
                            <span
                              className="absolute inset-0"
                              aria-hidden="true"
                            />
                            <p className="text-sm font-bold text-gray-900">
                              {result.incidentName}
                            </p>
                            <div className="mt-1 flex space-x-4">
                              <p className="flex items-center text-sm text-gray-500 truncate">
                                <CodeIcon
                                  className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-700"
                                  aria-hidden="true"
                                />{" "}
                                {result.paramApps.subName}
                              </p>
                              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {result.paramIncidentType
                                  ? result.paramIncidentType.incidentType
                                  : "-"}
                              </p>
                              <p
                                className={classNames(
                                  result.incidentStatus === "Open"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800",
                                  "px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                )}
                              >
                                {result.incidentStatus}
                              </p>
                            </div>
                          </a>
                        </Link>
                      </div>
                      <time
                        dateTime={result.logStartTime}
                        className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500"
                      >
                        {result.logStartTime
                          ? format(
                              new Date(result.logStartTime),
                              "dd MMMM yyyy HH:mm",
                              "id-ID"
                            )
                          : "-"}{" "}
                      </time>
                    </div>
                    <div className="mt-4">
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Impacted System : {result.impactedSystem}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Root Cause : {result.rootCause}
                      </p>
                      <p className="line-clamp-2 text-sm text-gray-600 truncate">
                        Action : {result.actionItem}
                      </p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default SearchIncident;
