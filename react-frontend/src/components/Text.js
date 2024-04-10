// Text.js
import Form from "./Form";

function Text({ label, name, type = "text", placeholder }) {
    return (
        <div className="w-full mb-4">
            <label className="block text font mb-2" htmlFor={name}>
                {label}
            </label>
            <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={name}
                type={type}
                placeholder={placeholder}
            />
        </div>
    );
}
export default Text;
