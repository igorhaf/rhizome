import React from 'react';

function Text({ label, name, placeholder }) {
    // Aplicando estilos condicionalmente se o tipo é 'text' ou 'textarea'
    return (
        <div className="w-full mb-4">
            <label className="block mb-2 text-primary" htmlFor={name}>
                {label}
            </label>
                <input
                    className="shadow appearance-none rounded w-full py-2 px-3 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                    id={name}
                    placeholder={placeholder}
                />
        </div>
    );
}

export default Text;

