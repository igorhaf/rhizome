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
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-1/5 bg-gray-200 h-4 rounded-lg overflow-hidden">
                <div
                    className="bg-blue-600 h-4 rounded-lg transition-width duration-150 ease-in-out"
                    style={{ width: getProgressWidth() }}
                >
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
