import React from 'react';

const ProgressBar = ({ progress, show }) => {
    const getProgressWidth = () => {
        const normalizedProgress = Math.min(Math.max(progress, 0), 100);
        return `${normalizedProgress}%`;
    };

    if (!show) {
        return null;
    }

    return (

        <div className="w-1/5 bg-gray-50 h-4 rounded-lg overflow-hidden text-center z-0">
            <div
                className="bg-blue-400 h-4 rounded-lg transition-width duration-150 ease-in-out"
                style={{ width: getProgressWidth()}}
            >
            </div>
        </div>
    );
};

export default ProgressBar;
