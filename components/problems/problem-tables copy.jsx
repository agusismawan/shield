import {
  EyeIcon,
  ChevronDoubleUpIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { useState, useMemo } from "react";
import format from "date-fns/format";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const ProblemTables = ({ problems }) => {
  const itemsPerPage = 10;
  const [page, setPage] = useState(1);
  const displayData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return problems.data.slice(start, start + itemsPerPage);
  }, [problems]);
  let nomor = 1;

  function renderPriority(problem) {
    if (problem.idPriorityMatrix == 1) {
      // ini icon Critical
      return <ChevronDoubleUpIcon className=" w-6 h-auto text-red-600" />;
    } else if (problem.idPriorityMatrix ==  3) {
      // ini icon High
      return <ChevronUpIcon className=" w-6 h-auto text-yellow-600" />;
    } else if (problem.idPriorityMatrix == 6) {
      // ini icon Medium
      return <ChevronRightIcon className=" w-6 h-auto text-blue-600" />;
    } else {
      // ini icon Low
      return <ChevronDownIcon className=" w-6 h-auto text-green-600" />;
    }
  }

  function renderStatus(problem) {
    if (problem.status == "Analyzing RCA") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {problem.status}
        </span>
      );
    } else if (problem.status == "Approval RCA") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
          {problem.status}
        </span>
      );
    } else if (problem.status == "Workaround Implementation") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
          {problem.status}
        </span>
      );
    } else if (problem.status === "Problem Solved") {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          {problem.status}
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
          {problem.status}
        </span>
      );
    }
  }

  return (
    <>
      <table className="min-w-full">
        <thead>
          <tr className="border-t border-gray-200">
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="lg:pl-2">No.</span>
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="lg:pl-2">Problem Name/Time</span>
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Followup by
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Latest Progress
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {displayData.map((problem) => (
            <tr key={problem.id.toString()}>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                <div className="text-sm text-gray-900 text-center">
                  {nomor++}
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                {renderPriority(problem)}
                <span className="px-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {problem.rootCause.source}
                </span>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                <div className="text-sm text-gray-500">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    {problem.incident
                      ? problem.incident.incidentNumber
                      : "Tidak ada Incident"}
                  </a>
                  {` | PR-${problem.id}-${format(
                    new Date(problem.createdAt),
                    "MMddyy"
                  )}`}
                </div>
                <div className="text-base text-gray-900">
                  {problem.problemName}
                </div>
                <div className="text-xs text-gray-500">
                  {format(new Date(problem.createdAt), "d LLLL yyyy hh:mm")}
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                {renderStatus(problem)}
                <br />
                <div className="text-xs text-gray-500">
                  IPR-APP-21-10-2021
                  <br />
                  IPR Perbaikan Aplikasi PortalSSO
                </div>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal">
                <div className="text-sm text-gray-900">
                  {problem.user.fullName
                    ? problem.user.fullName
                    : problem.user.userName}
                </div>
                <div className="text-xs text-gray-500">{problem.status}</div>
              </td>
              <td className="px-6 py-3 text-sm text-gray-500 font-normal w-1/5">
                Get Latest Progress
              </td>
              <td>
                <a
                  href={`/problem/${problem.id}`}
                  className="bg-gray-100 text-gray-900"
                >
                  <EyeIcon
                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </a>
              </td>
              {/* Begin ofMenu Option */}
              {/* <td className="pr-6">
                <Menu
                  as="div"
                  className="relative flex justify-end items-center"
                >
                  {({ open }) => (
                    <>
                      <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="sr-only">Open options</span>
                        <DotsVerticalIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          static
                          className="mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg z-10 bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
                        >
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href={`/problems/${problem.id}`}
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "group flex items-center px-4 py-2 text-sm"
                                  )}
                                >
                                  <EyeIcon
                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  View
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                          <div className="py-1">
                            <Menu.Item>
                              {({ active }) => (
                                <a
                                  href="#"
                                  className={classNames(
                                    active
                                      ? "bg-gray-100 text-gray-900"
                                      : "text-gray-700",
                                    "group flex items-center px-4 py-2 text-sm"
                                  )}
                                >
                                  <PencilAltIcon
                                    className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                  Edit
                                </a>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </>
                  )}
                </Menu>
              </td> */}
              {/* End of Menu Option */}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ProblemTables;
