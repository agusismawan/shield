import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { SearchIcon } from "@heroicons/react/outline";
import 'regenerator-runtime';

const GlobalFilter = ({ filter, setFilter, preGlobalFilteredRows }) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(filter);
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000)

    return (
        // <div>
        //     <label htmlFor="global-search" className="block text-sm font-medium text-gray-700">
        //         Search
        //     </label>
        //     <div className="mt-1">
        //         <input
        //             type="search"
        //             value={value || ''}
        //             onChange={(e) => {
        //                 setValue(e.target.value)
        //                 onChange(e.target.value)
        //             }}
        //             placeholder={`${count} records...`}
        //             className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-80 sm:text-sm border-gray-300 rounded-md"
        //         />
        //     </div>
        // </div>

        <div>
            <label htmlFor="GlobalFilter" className="block text-sm font-medium text-gray-700">
                Search
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                    type="search"
                    name="GlobalFilter"
                    id="GlobalFilter"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={value || ''}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange(e.target.value)
                    }}
                    placeholder={`${count} records...`}
                />
            </div>
        </div>
    )
}

export default GlobalFilter;