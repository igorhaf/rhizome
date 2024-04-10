import React from 'react';
import Nodes from './Nodes'; // Presumindo que Nodes é um componente que você tem

const Elements = ({ elements }) => {
    return (
        <span>
            <h2  className="text font-semibold p-4" style={{paddingBottom:'20px'}}>Components</h2>
            <div className="flex flex-col h-full overflow-auto" style={{ paddingBottom: '0px' }}>
                <div className="flex-1">
                    <div className="min-w-max">
                        <Nodes treeData={elements} />
                    </div>
                </div>
            </div>
        </span>
    );
};

export default Elements;
