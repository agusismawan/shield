import { classNames } from "../utils";

const StatusPill = ({ value }) => {
    const status = value ? value.toLowerCase() : "-";

    return (
        <span
            className={classNames(
                "px-3 py-1 capitalize leading-wide font-medium text-xs rounded-full shadow-sm",
                status.startsWith("low") ? "bg-blue-100 text-blue-500" : null,
                status.startsWith("medium") ? "bg-yellow-100 text-yellow-400" : null,
                status.startsWith("high") ? "bg-yellow-500 text-yellow-900" : null,
                status.startsWith("critical") ? "bg-red-100 text-red-500" : null
            )}
        >
            {status}
        </span>
    );
}

const StatusText = ({ value, row }) => {

    const status = row.original.idApps ? (row.original.paramApps.criticalityApp ? row.original.paramApps.criticalityApp.toLowerCase() : "-") : "-";

    return (
        row.original.idApps ?
            <div>
                <div className="text-xs font-normal text-gray-900">{value}</div>
                {/* <div className="text-xs font-normal text-gray-500">{status}</div> */}
                <span
                    className={classNames(
                        "text-xs font-normal capitalize",
                        status.startsWith("low") ? "text-blue-500" : null,
                        status.startsWith("medium") ? "text-yellow-400" : null,
                        status.startsWith("high") ? "text-yellow-900" : null,
                        status.startsWith("critical") ? "text-red-500" : null,
                        status.startsWith("critical severity 2") ? "text-red-500" : null,
                        status.startsWith("critical severity 1") ? "text-red-500" : null
                    )}
                >
                    {status}
                </span>
            </div>
            : status
    )
}

export { StatusPill, StatusText };