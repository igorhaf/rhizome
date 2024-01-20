import React from 'react';
import { FolderOpenIcon, FolderIcon, DocumentIcon } from '@heroicons/react/solid'; // Supondo que esses ícones estão disponíveis em React

const TreeView = ({ treeData }) => {
    const toggle = (node) => {
        node.expanded = !node.expanded;
        // Force update since we're mutating the node directly
        // Idealmente, você deve evitar mutações diretas e usar uma abordagem de estado imutável
        treeData([...treeData]);
    };

    const startDrag = (event, node) => {
        event.dataTransfer.setData('nodeData', JSON.stringify(node));
    };

    return (
        <ul className="pl-4 space-y-2">
            {treeData.map(node => (
                <li key={node.id}>
                    <div className="flex items-center space-x-2" onClick={() => toggle(node)}>
                        <span>
                            {node.children && node.children.length > 0 ? (
                                node.expanded ? <FolderOpenIcon className="w-6 h-6 text-yellow-400" /> : <FolderIcon className="w-6 h-6 text-yellow-400" />
                            ) : (
                                <div className={['nb-icons', node.iconClass].join(' ')} onDragStart={(event) => startDrag(event, node)} draggable="true"></div>
                            )}
                        </span>
                        <span className="text">{node.name}</span>
                    </div>
                    {node.expanded && node.children && <TreeView treeData={node.children} />}
                </li>
            ))}
        </ul>
    );
};

export default TreeView;
