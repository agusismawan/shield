function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const styledReactSelect = {
  input: (base) => ({
    ...base,
    "input:focus": {
      boxShadow: "none",
    },
  }),
  menu: (base) => ({
    ...base,
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  }),
};

const styledReactSelectAdd = {
  input: (base) => ({
    ...base,
    "input:focus": {
      boxShadow: "none",
    },
  }),
  menuList: (styles) => {
    return {
      ...styles,
      maxHeight: 150,
    };
  },
};

export { classNames, styledReactSelect, styledReactSelectAdd };
