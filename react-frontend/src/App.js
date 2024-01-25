// App.js
import React, { useState } from 'react';
import ColumnOne from './ColumnOne';
import ColumnTwo from './ColumnTwo';
import ColumnThree from './ColumnThree';
import Footer from './Footer';

function App() {
    const [text, setText] = useState('');
    const [liveText, setLiveText] = useState('');

    const handleTextChange = (newText) => {
        setText(newText);
    };

    const handleLiveTextChange = (newText) => {
        setLiveText(newText);
    };

    return (
        <div className="h-screen flex flex-col">
                <div /*ref="splitContainer" */ style={{backgroundColor: "#1e1f22"}} className=" overflow-hidden split-container flex-1 flex">
                {/* <Column1 text={text} onLiveTextChange={handleLiveTextChange} /> */}
                <div className="split-pane">
                    <ColumnOne className="flex-1 h-full" />
                </div>
                
                {/* <Column2 liveText={liveText} /> */}
                <div className="split-pane">
                    <ColumnTwo className="flex-grow overflow-hidden h-full" />
                </div>
                {/* <Column3 onTextChange={handleTextChange} /> */}
                <div className="split-pane">
                    <ColumnThree className="flex-1  h-full" />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
