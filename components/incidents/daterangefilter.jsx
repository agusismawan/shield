import { DatePicker, Space } from 'antd';
import "antd/dist/antd.css";

const { RangePicker } = DatePicker;

const handleChange = (value, dateString) => {
    console.log(dateString[0])
}

function DateRangeFilter() {
    return (
        <Space direction="vertical" size={12}>
            <RangePicker
                style={{
                    borderRadius: "0.375rem",
                    width: "100%",
                    height: "38px",
                }}
                onChange={handleChange}
            />
        </Space>
    )
}

export default DateRangeFilter;