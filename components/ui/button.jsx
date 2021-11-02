import React from "react";
import { classNames } from "../utils";

const ButtonSmall = ({ children, className, type, ...rest }) => {
    return (
        <button
            type={type}
            className={classNames("inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", className)} {...rest}
        >
            {children}
        </button>
    )
}

const ButtonSecondary = ({ children, ...rest }) => {
    return (
        <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            {...rest}
        >
            {children}
        </button>
    )
}

export { ButtonSmall, ButtonSecondary };