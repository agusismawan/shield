import { DatePicker as AntDatePicker } from "antd";

const { RangePicker } = AntDatePicker;

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
