import React from 'react';

function Select({ label, name, options }) {
    return (
        <div className="w-full mb-1">
            <label className="block mb-1 text-primary" htmlFor={name}>
                {label}
            </label>
            <select

                className="shadow appearance-none text-primary w-full py-0.5 px-2 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                id={name}
            >
                {options.map(option => (
                    <option key={option.value} value={option.value} className="bg-black text-white">
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
