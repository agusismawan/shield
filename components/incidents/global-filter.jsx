import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import 'regenerator-runtime';

const GlobalFilter = ({ filter, setFilter, preGlobalFilteredRows }) => {
    const count = preGlobalFilteredRows.length;
    const [value, setValue] = useState(filter);
    const onChange = useAsyncDebounce(value => {
        setFilter(value || undefined)
    }, 1000)

    return (
        <div>
            <label htmlFor="global-search" className="block text-sm font-medium text-gray-700">
                Search
            </label>
            <div className="mt-1">
                <input
                    type="search"
                    value={value || ''}
                    onChange={(e) => {
                        setValue(e.target.value)
                        onChange(e.target.value)
                    }}
                    placeholder={`${count} records...`}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-80 sm:text-sm border-gray-300 rounded-md"
                />
            </div>
        </div>
    )
}

export default GlobalFilter;