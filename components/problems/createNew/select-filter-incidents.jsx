import { useState, useEffect } from "react"
import axios from "axios"
import Select from "react-select"

function SelectFilterIncidents() {
  const [options, setOptions] = useState([])
  const [incident, setIncident] = useState(options[0])

  useEffect(() => {
    async function getData() {
      try {
        const res = await axios.get(
          "http://127.0.0.1:3030/v1/probman/incident/all"
        )
        const result = res.data
        const selectValue = result.data.map((data) => ({
          id: data.id,
          value: data.id,
          label: `${data.incidentNumber} . ${data.incidentName}`,
        }))

        setOptions(selectValue)
      } catch (error) {
        return error
      }
    }

    getData()
  }, [])

  const handleOnchange = (chosenValue) => {
    const item = chosenValue === null ? "" : chosenValue // untuk menghandle nilai null
    setIncident(item)
    // setFilter(item.value || undefined)
  }

  // custom style untuk menghilangkan outline pada saat search input
  const style = {
    input: (base) => ({
      ...base,
      "input:focus": {
        boxShadow: "none",
      },
    }),
  }

  return (
    <Select
      key={incident}
      id="idIncident"
      name="idIncident"
      value={incident}
      options={options}
      onChange={handleOnchange}
      defaultValue={options}
      isClearable
      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-100 sm:text-sm border-gray-300 rounded-md"
      styles={style}
      placeholder={"Select Incident"}
    />
  )
}

export default SelectFilterIncidents
