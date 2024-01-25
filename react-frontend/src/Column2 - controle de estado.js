// Column2.js
import React from 'react';
import { useSelector } from 'react-redux';

function Column2() {
    const liveText = useSelector(state => state.text.liveText);

    return (
        <div style={{ flex: 1, padding: '10px', backgroundColor: '#d0d0d0' }}>
            <h2>Coluna 2</h2>
            <p>{liveText}</p>
        </div>
    );
}

export default Column2;
