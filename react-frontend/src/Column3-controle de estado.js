// Column3.js
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setText } from './redux/actions/textActions';

function Column3() {
    const [inputText, setInputText] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setText(inputText));
    };

    return (
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#b0b0b0' }}>
            <h2>Coluna 3</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                />
                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}

export default Column3;
