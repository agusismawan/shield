import { useState } from "react";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import { toast } from "react-toastify";
import { styledReactSelect } from "../utils";

function SelectColumnFilter({ column: { setFilter } }) {
    const [selectedValue, setSelectedValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const loadApplications = (inputValue, callback) => {
        clearTimeout(timeoutId);

        if (inputValue.length < 3) {
            return callback([]);
        }

        const timeoutId = setTimeout(() => {
            axios
                .get(`https://ularkadut.xyz/v1.0/parameters/app?name=${inputValue}`)
                .then((res) => {
                    const cacheOptions = res.data.data.map(d => ({
                        "value": d.name,
                        "label": d.name
                    }))

                    callback(cacheOptions)
                })
                .catch(err => toast.error(`Application ${err}`))
        }, 500);
    }

    const handleChange = (value) => {
        const item = !value ? '' : value;
        setSelectedValue(value);
        setFilter(item.value || undefined);
    }

    const handleInputChange = value => {
        setInputValue(value);
    };

    return (
        <div className="mt-1">
            <AsyncSelect
                styles={styledReactSelect}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-80 sm:text-sm border-gray-300 rounded-md"
                placeholder="Type an Application"
                isClearable
                cacheOptions
                loadOptions={loadApplications}
                getOptionLabel={e => e.label}
                getOptionValue={e => e.value}
                onChange={handleChange}
                onInputChange={handleInputChange}
                value={selectedValue}
            />
        </div>
    )
}

export default SelectColumnFilter;