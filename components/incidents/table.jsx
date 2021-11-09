import { useTable, useSortBy, useGlobalFilter, useFilters, usePagination } from "react-table";
import GlobalFilter from "./global-filter";
import { ChevronDoubleLeftIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { Button, PageButton } from "../ui/pagination-button";
import { SortIcon, SortUpIcon, SortDownIcon } from "../ui/short-icon";

function Table({ columns, data }) {
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
        setGlobalFilter,
        preGlobalFilteredRows
    } = useTable({ columns, data }, useGlobalFilter, useFilters, useSortBy, usePagination);

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        <>
            <div className="flex gap-x-2">
                <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} preGlobalFilteredRows={preGlobalFilteredRows} />

                {/* Untuk menampilkan ui select filter */}
                {headerGroups.map((headerGroup) =>
                    headerGroup.headers.map((column) =>
                        column.Filter ? (
                            <div key={column.id}>
                                <label className="block text-sm font-medium text-gray-700">{column.render('Header')}</label>
                                {column.render('Filter')}
                            </div>
                        ) : null
                    )
                )}
            </div>

            <div className="flex flex-col mt-3">
                <div className="align-middle min-w-full overflow-x-auto shadow overflow-hidden sm:rounded-lg">
                    <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="group flex items-center justify-between">
                                                {column.render('Header')}
                                                <span>
                                                    {column.isSorted ? (column.isSortedDesc ?
                                                        <SortDownIcon className="w-4 h-4 text-gray-400" />
                                                        : <SortUpIcon className="w-4 h-4 text-gray-400" />)
                                                        : <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                                                    }
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
                            {
                                page.map(row => {
                                    prepareRow(row)
                                    return (
                                        <tr {...row.getRowProps()} className="bg-white">
                                            {row.cells.map((cell) => {
                                                return (
                                                    <td {...cell.getCellProps()} className="px-6 py-3 text-sm text-gray-500 font-normal">
                                                        {cell.render('Cell')}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {/* START Pagination */}
            <div className="py-3 flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="flex gap-x-2 items-baseline">
                        <span className="text-sm text-gray-700">
                            Page {' '} <span className="font-medium">{pageIndex + 1}</span> of <span className="font-medium">{pageOptions.length}</span>{' '}
                        </span>
                        <select id="page-size" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}
                            className="mt-1 ml-1 block text-base text-gray-700 border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            defaultValue={10}>
                            {[10, 25, 50].map((pageSize) => (
                                <option key={pageSize} value={pageSize}>Show {pageSize}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <PageButton onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="rounded-l-md">
                                <span className="sr-only">First</span>
                                <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton onClick={() => previousPage()} disabled={!canPreviousPage}>
                                <span className="sr-only">Previous</span>
                                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                                <span className="sr-only">Next</span>
                                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                            <PageButton onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} className="rounded-r-md">
                                <span className="sr-only">Last</span>
                                <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
                            </PageButton>
                        </nav>
                    </div>
                </div>
            </div>
            {/* END of Pagination */}
        </>
    )
}

export default Table;