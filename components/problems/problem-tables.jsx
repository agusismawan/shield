import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
} from "react-table"
import { classNames } from "../utils"
import { SortIcon, SortUpIcon, SortDownIcon } from "../ui/short-icon"

function ProblemTables({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    gotoPage,
    pageCount,
    setPageSize,
    pageOptions,
    prepareRow,
    state,
  } = useTable({ columns, data }, useFilters, useSortBy, usePagination)

  const { pageIndex, pageSize } = state

  return (
    <>
      <table {...getTableProps()} className="min-w-full">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={classNames(
                    "px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.Header === "Problem Name"
                  )}
                >
                  <div className="group flex items-center justify-between">
                    {column.render("Header")}
                    <span>
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <SortDownIcon className="w-4 h-4 text-green-400" />
                        ) : (
                          <SortUpIcon className="w-4 h-4 text-green-400" />
                        )
                      ) : (
                        column.canSort && (
                          <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                        )
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-100"
        >
          {page.map((row) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-3 text-sm text-gray-500 font-normal"
                    >
                      {cell.render("Cell")}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default ProblemTables