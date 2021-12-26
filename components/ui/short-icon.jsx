import {
  // ChevronUpIcon, ChevronDownIcon, 
  ArrowUpIcon, ArrowDownIcon, SelectorIcon
} from "@heroicons/react/solid";

const SortIcon = ({ className }) => {
  return (
    <SelectorIcon className={className} />
  )
}

const SortUpIcon = ({ className }) => {
  return (
    // <ChevronUpIcon className={className} />
    <ArrowUpIcon className={className} />
  )
}

const SortDownIcon = ({ className }) => {
  return (
    // <ChevronDownIcon className={className} />
    <ArrowDownIcon className={className} />
  )
}

export { SortIcon, SortUpIcon, SortDownIcon };