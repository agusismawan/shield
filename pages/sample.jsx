import { DatePicker, Space } from 'antd';
import "antd/dist/antd.css";
import { useMemo } from 'react';

const { RangePicker } = DatePicker;

const handleChange = (value, dateString) => {
  console.log(dateString[0])
}

function DateRangeFilter({ column: { filterValue = [], preFilteredRows, setFilter, id } }) {
  const [min, max] = useMemo(() => {
    let min = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)
    let max = preFilteredRows.length ? new Date(preFilteredRows[0].values[id]) : new Date(0)

    preFilteredRows.forEach(row => {
      const rowDate = new Date(row.values[id])

      min = rowDate <= min ? rowDate : min
      max = rowDate >= max ? rowDate : max
    })

    return [min, max]
  }, [id, preFilteredRows])

  return (
    <Space direction="vertical" size={12}>
      <RangePicker
        style={{
          borderRadius: "0.375rem",
          width: "100%",
          height: "38px",
          marginTop: "0.25rem"
        }}
        className="mt-16"
        onChange={handleChange}
      />
    </Space>
  )
}

export default DateRangeFilter;