// Select.js
import Textarea from "./Textarea";

function Select({ label, name, options }) {
    return (
        <div className="w-full mb-4">
            <label className="block text font mb-2" htmlFor={name}>
                {label}
            </label>
            <select
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={name}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
export default Select;
