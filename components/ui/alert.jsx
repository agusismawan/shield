import { InformationCircleIcon } from "@heroicons/react/solid";
import { classNames } from "../utils";

const AlertInfo = ({ children, className, message }) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className={classNames("text-sm text-blue-700", className)}>
            {message}
          </p>
          {children}
        </div>
      </div>
    </div>
  );
};

export { AlertInfo };
