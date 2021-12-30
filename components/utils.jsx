function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

const styledReactSelect = {
    input: (base) => ({
        ...base,
        'input:focus': {
            boxShadow: 'none',
        },
    }),
}

export { classNames, styledReactSelect }
