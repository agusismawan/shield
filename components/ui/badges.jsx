import { classNames } from "../utils";

const Badges = ({ text }) => {
    return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {text}
        </span>
    );
}

const BadgesWithDot = ({ text, className, dotColor, ...rest }) => {
    return (
        <span className={classNames("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize", className)} {...rest}>
            <svg className={classNames("mr-1.5 h-2 w-2", dotColor)} fill="currentColor" viewBox="0 0 8 8">
                <circle cx={4} cy={4} r={3} />
            </svg>
            {text}
        </span>
    )
}

export { Badges, BadgesWithDot };