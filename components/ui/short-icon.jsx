import { ChevronUpIcon, ChevronDownIcon, SelectorIcon } from "@heroicons/react/solid"

const SortIcon = ({ className }) => {
  return (
    <SelectorIcon className={className} />
  )
}

const SortUpIcon = ({ className }) => {
  return (
    <ChevronUpIcon className={className} />
  )
}

const SortDownIcon = ({ className }) => {
  return (
    <ChevronDownIcon className={className} />
  )
}

export { SortIcon, SortUpIcon, SortDownIcon };