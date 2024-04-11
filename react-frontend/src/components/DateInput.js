import React from 'react';

const DateInput = ({ label, value, onChange }) => {
    return (
        <div className="mb-1 w-full">
            <label className="block text-primary bg mb-1">{label}</label>
            <input
                type="date"
                value={value}
                onChange={onChange}
                className="focus:outline-none focus:box-shadow-blue-500 shadow text-primary appearance-none w-full py-1 px-1 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
            />
        </div>
    );
};

export default DateInput;