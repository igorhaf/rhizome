import React from 'react';
import { FolderIcon, FolderOpenIcon, DocumentIcon } from '@heroicons/react/solid';
import { useDispatch, useSelector } from 'react-redux';
import { toggleNode } from '../redux/actions'; // Certifique-se de que o caminho está correto
import TreeView from './TreeView';

const Objects = () => {
    const treeData = useSelector((state) => state.treeData);
    const dispatch = useDispatch();

    const handleToggle = (nodeId) => {
        dispatch(toggleNode(nodeId));
    };

    const handleAddFrame = () => {
        const frameName = "New Frame"; // Substitua com a lógica de nomeação desejada
        dispatch(addFrame(frameName));
    };

    const startDrag = (event, node) => {
        event.dataTransfer.setData('nodeData', JSON.stringify(node));
    };

    return (
        <ul className="pl-4 space-y-2">
            <div className="add-tab" onClick={handleAddFrame}>
                +
            </div>
            {treeData.map(node => (
                <li key={node.id}>
                    <div className="flex items-center space-x-2" onClick={() => dispatch(toggleNode(node))}>
                        <span>
                            {node.children && node.children.length > 0 ? (
                                node.expanded ? <FolderOpenIcon className="w-5 h-5 text-yellow-400" /> : <FolderIcon className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <DocumentIcon className="w-5 h-5" onDragStart={(event) => startDrag(event, node)} draggable="true" />
                            )}
                        </span>
                        <span className="text">{node.name}</span>
                    </div>
                    {node.expanded && node.children && <TreeView initialTreeData={node.children} />}
                </li>
            ))}
        </ul>
    );
};

export default Objects;
