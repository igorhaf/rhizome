import React from 'react';

const TimeInput = ({ label, value, onChange }) => {
    return (
        <div className="mb-1 w-full">
            <label className="block mb-1 bg text-primary">{label}</label>
            <input
                type="time"
                value={value}
                onChange={onChange}
                className="focus:outline-none focus:box-shadow-blue-500 shadow text-primary appearance-none w-full py-1 px-1 bg text border focus:border-blue-500 focus:outline-blue leading-tight h-6"
            />
        </div>
    );
};

export default TimeInput;