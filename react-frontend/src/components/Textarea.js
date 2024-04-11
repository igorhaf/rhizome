import React from 'react';

function Textarea({ label, name, placeholder }) {
    return (
        <div className="mb-1">
            <label className="block mb-2 text-primary" htmlFor={name}>
                {label}
            </label>
            <textarea
                className="focus:outline-none focus:box-shadow-blue-500 shadow text-primary appearance-none w-full py-1 px-1 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                id={name}
                placeholder={placeholder}
            />
        </div>
    );
}

export default Textarea;
