import React from "react";

const GlobalFilter = ({ setGlobalFilter }) => {
  return (
    <div>
      <input
        onChange={(e) => {
          setGlobalFilter(e.target.value);
        }}
        placeholder="Global filter outside table"
      />
    </div>
  );
};

export default GlobalFilter;
