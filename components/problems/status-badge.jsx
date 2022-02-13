import {
  ChevronDownIcon,
  MenuAlt4Icon,
  ChevronUpIcon,
  ChevronDoubleUpIcon,
} from "@heroicons/react/solid";
import { Tooltip } from "antd";
import "antd/dist/antd.css";
import { BadgesWithDot } from "../ui/badges";

const PriorityArrow = ({ value }) => {
  const priority = value ? value.toLowerCase() : "-";

  return priority.startsWith("low") ? (
    <Tooltip title="Low">
      <ChevronDownIcon className="h-5 w-5 text-blue-500" />
    </Tooltip>
  ) : priority.startsWith("medium") ? (
    <Tooltip title="Medium">
      <MenuAlt4Icon className="h-5 w-5 text-yellow-500" />
    </Tooltip>
  ) : priority.startsWith("high") ? (
    <Tooltip title="High">
      <ChevronUpIcon className="h-5 w-5 text-red-500" />
    </Tooltip>
  ) : priority.startsWith("critical") ? (
    <Tooltip title="Critical">
      <ChevronDoubleUpIcon className="h-5 w-5 text-red-500" />
    </Tooltip>
  ) : (
    "-"
  );
};

const SourcePill = ({ value }) => {
  const source = value ? value.toLowerCase() : "-";

  return source.startsWith("incident") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-red-100 text-gray-800">
      {value}
    </span>
  ) : source.startsWith("problem") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-yellow-100 text-gray-800">
      {value}
    </span>
  ) : source.startsWith("healthcheck") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-gray-800">
      {value}
    </span>
  ) : (
    <span className="px-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
      Others
    </span>
  );
};

const StatusPill = ({ value }) => {
  const status = value ? value.toLowerCase() : "-";

  return status.startsWith("draft" || "unassigned") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
      {value}
    </span>
  ) : status.startsWith("analyzing rca") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-yellow-100 text-gray-800">
      {value}
    </span>
  ) : status.startsWith("workaround implementation") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-blue-100 text-gray-800">
      {value}
    </span>
  ) : status.startsWith("need acknowledged" || "problem solved") ? (
    <span className="px-2 text-xs font-semibold rounded-full bg-green-100 text-gray-800">
      {value}
    </span>
  ) : (
    <span className="px-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
      Others
    </span>
  );
};

const StatusText = ({ value, row }) => {
  const criticality = row.original.idApps
    ? row.original.app.criticalityApp
      ? row.original.app.criticalityApp.toLowerCase()
      : "-"
    : "-";

  return row.original.idApps ? (
    <div>
      <div className="text-xs text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 capitalize">{criticality}</div>
    </div>
  ) : (
    criticality
  );
};

const StatusIncident = ({ value }) => {
  const status = value ? value.toLowerCase() : "";

  return (
    <BadgesWithDot
      text={status}
      className={
        status.startsWith("open")
          ? "bg-red-100 text-red-800"
          : status.startsWith("resolved")
          ? "bg-green-100 text-green-800"
          : "bg-gray-100 text-gray-800"
      }
      dotColor={
        status.startsWith("open")
          ? "text-red-400"
          : status.startsWith("resolved")
          ? "text-green-400"
          : "text-gray-400"
      }
    />
  );
};

export { PriorityArrow, SourcePill, StatusPill, StatusText, StatusIncident };
