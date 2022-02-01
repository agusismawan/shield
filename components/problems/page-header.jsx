import ModalCreate from "./createNew/modal-create"
import { useRouter } from "next/router"

const PageHeader = ({ title }) => {
  const router = useRouter()
  if (router.route === "/problem/createNew") {
    const display = "none"
  } else {
    const display = ""
  }
  return (
    <>
      <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="inline-block py-1 text-lg font-medium text-gray-900 sm:truncate">
            {title}
            <ModalCreate />
          </h1>
        </div>
      </div>
    </>
  )
}

export default PageHeader
