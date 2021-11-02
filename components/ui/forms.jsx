import { classNames } from "../utils";

const Input = ({ label, name, placeholder, className, register, required }) => (
    <>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...register(name, { required })}
            type="text"
            name={name}
            className={classNames("mt-1 block shadow-sm border-gray-300 sm:text-sm rounded-md w-full", className)}
            placeholder={placeholder}
        />
    </>
);

export { Input };