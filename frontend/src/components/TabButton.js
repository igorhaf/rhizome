import React from 'react';

const TabButton = ({buttonText}) => {
    return (
        <div className="flex mt-2">
            <button type="button"
                    className="flex-grow bg-blue-400 hover:bg-blue-500 text-white py-1 text-xs px-4 rounded mr-1">
                {buttonText}
            </button>
        </div>
    );
};

export default TabButton;