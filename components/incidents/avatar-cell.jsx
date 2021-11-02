import { UserCircleIcon } from "@heroicons/react/solid";

function AvatarCell() {
    return (
        <div className="flex items-center">
            <div className="flex-shrink-0 h-7 w-7">
                {/* <img
            className="h-10 w-10 rounded-full"
            src={row.original[column.imgAccessor]}
            alt=""
          /> */}
                <UserCircleIcon className="h-7 w-7" />
            </div>
            <div className="ml-2">
                <div className="text-xs font-normal text-gray-900">Lord Commander</div>
                <div className="text-xs font-normal text-gray-500">IT Service Desk</div>
            </div>
        </div>
    );
}

export default AvatarCell;