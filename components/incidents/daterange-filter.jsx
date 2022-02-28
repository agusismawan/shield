import { DatePicker } from "antd";

const { RangePicker } = DatePicker;

const DateRangeFilter = ({ ...rest }) => {
  return (
    <RangePicker
      style={{
        borderRadius: "0.375rem",
        width: "15rem",
        height: "38px",
      }}
      {...rest}
    />
  );
};

export default DateRangeFilter;
