import React from 'react';

function Textarea({ label, name, placeholder }) {
    return (
        <div className="mb-4">
            <label className="block mb-2 text" htmlFor={name}>
                {label}
            </label>
            <textarea
                className="shadow appearance-none rounded w-full py-2 px-3 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                id={name}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Textarea;
