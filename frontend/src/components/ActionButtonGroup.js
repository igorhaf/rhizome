import React from 'react';

const ActionButtonGroup = () => {
    return (
        <div className="flex mt-2">
            <button type="button"
                    className="flex-grow bg-blue-400 hover:bg-blue-500 text-white py-1 text-xs px-4 rounded-l mr-1">
                Aplicar
            </button>
            <button type="button"
                    className="flex-grow bg-blue-400 hover:bg-blue-500 text-white py-1 text-xs px-4 rounded-r">
                Cancelar
            </button>
        </div>
    );
};

export default ActionButtonGroup;