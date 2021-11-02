import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function SelectColumnFilter({ column: { filterValue, setFilter } }) {
    const [options, setOptions] = useState([]);
    const [application, setApplication] = useState(options[0]);

    useEffect(() => {
        async function getData() {
            try {
                const res = await axios.get("https://ularkadut.xyz/v1.0/parameters/app");
                const result = res.data;
                const selectValue = result.data.map(d => ({
                    "value": d.name,
                    "label": d.name
                }));

                setOptions(selectValue);
            } catch (e) {
                return e;
            }
        }

        getData();
    }, [])

    const handleOnchange = (chosenValue) => {
        const item = chosenValue === null ? '' : chosenValue; // untuk menghandle nilai null
        setApplication(item);
        setFilter(item.value || undefined);
    }

    // custom style untuk menghilangkan outline pada saat search input
    const style = {
        input: (base) => ({
            ...base,
            'input:focus': {
                boxShadow: 'none',
            },
        }),
    }

    return (
        <div className="mt-1">
            <Select
                value={application}
                options={options}
                onChange={handleOnchange}
                defaultValue={options}
                isClearable
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-80 sm:text-sm border-gray-300 rounded-md"
                styles={style}
                placeholder={"Select Application"}
            />
        </div>
    )
}

export default SelectColumnFilter;