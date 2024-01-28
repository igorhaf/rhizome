// Footer.js
import React from 'react';
import { useSelector } from 'react-redux';
import './Footer.css'

function Footer() {
    const text = useSelector(state => state.text.text);
    return (
        <footer className="bg text w-full p-1 flex items-center">
            <div className='debug-point-red debug-point'></div>
            <span class="ml-2">{text}</span>
        </footer>
    );
}

export default Footer;
