import React, { useEffect, useRef } from 'react';
import Split from 'split.js';
//import FooterComponent from './FooterComponent'; // Assume que esses componentes foram convertidos para React
import ColumnOne from './ColumnOne';
/*import ColumnTwo from './ColumnTwo';
import ColumnThree from './ColumnThree';*/

const Main = () => {
    const splitContainerRef = useRef(null);

    useEffect(() => {
        if (splitContainerRef.current) {
            const splitPanes = splitContainerRef.current.querySelectorAll('.split-pane');
            if (splitPanes.length === 3) {
                Split(Array.from(splitPanes), {
                    sizes: [20, 65, 15],
                    minSize: 0,
                    gutterSize: 8,
                    cursor: 'col-resize',
                });
            }
        } else {
            console.log("splitContainer não está definido ainda!");
        }
    }, []);

    return (
        <div className="h-screen flex flex-col" style={"backgroundColor: #000"}>
            <div ref={splitContainerRef} style={{ backgroundColor: '#1e1f22' }} className="overflow-hidden split-container flex-1 flex">
                <div className="split-pane">
                    <p>teste</p>
                    {<ColumnOne className="flex-1 h-full" />}
                    
                </div>
                <div className="split-pane">
                    {/*<ColumnTwo className="flex-grow overflow-hidden h-full" />*/}
                </div>
                <div className="split-pane">
                    {/*<ColumnThree className="flex-1 h-full" />*/}
                </div>
            </div>

            {/*<FooterComponent />*/}
        </div>
    );
};

export default Main;
