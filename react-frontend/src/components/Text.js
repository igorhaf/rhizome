import React from 'react';

function Text({ label, name, placeholder }) {
    // Aplicando estilos condicionalmente se o tipo é 'text' ou 'textarea'
    return (
        <div className="w-full mb-1">
            <label className="block mb-1 text-primary" htmlFor={name}>
                {label}
            </label>
                <input
                    className="shadow text-primary appearance-none w-full py-0.5 px-2 bg text border focus:border-blue-500 focus:outline-blue leading-tight"
                    id={name}
                    placeholder={placeholder}
                />
        </div>
    );
}

export default Text;

