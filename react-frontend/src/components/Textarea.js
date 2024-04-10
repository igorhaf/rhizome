// Textarea.js
import Text from "./Text";

function Textarea({ label, name, placeholder }) {
    return (
        <div className="mb-4">
            <label className="block text font mb-2" htmlFor={name}>
                {label}
            </label>
            <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={name}
                placeholder={placeholder}
            />
        </div>
    );
}
export default Textarea;
