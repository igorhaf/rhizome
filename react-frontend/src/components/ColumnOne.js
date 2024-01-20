import React, { useState, useEffect } from 'react';
import TreeView from './TreeView'; // Supondo que TreeView já foi convertido para React
import Objects from './Objects'; // Supondo que Objects já foi convertido para React
import QuickAccessBar from './QuickAccessBar'; // Supondo que QuickAccessBar já foi convertido para React
import {EventBus} from '../EventBus'; // Adaptar para o EventBus em React, se necessário

const ColumnOne = () => {
    const [currentComponent, setCurrentComponent] = useState('treeView');
    const [logic] = useState([
        {
            id: 1,
            name: "Core",
            expanded: true,
            children: [
                { id: 2, name: "Start", type: "start", iconClass: "start" },
                { id: 3, name: "Schedule", type: "schedule", iconClass: "schedule" },
                { id: 4, name: "If", type: "if", iconClass: "if" },
                { id: 5, name: "Switch", type: "switch", iconClass: "switch" },
                { id: 6, name: "Sleep", type: "sleep", iconClass: "sleep" },
                { id: 7, name: "Start Time", type: "starttime", iconClass: "starttime" },
                { id: 8, name: "Webhook", type: "webhook", iconClass: "webhook" },
                { id: 9, name: "Api", type: "api", iconClass: "api" },
                { id: 10, name: "Exception", type: "exception", iconClass: "exception" },
                { id: 11, name: "Link", type: "link", iconClass: "link" },
                { id: 12, name: "Stop", type: "stop", iconClass: "stop" },
                { id: 13, name: "Query", type: "query", iconClass: "query" },
                { id: 30, name: "Javascript", type: "javascript", iconClass: "javascript" },
                { id: 50, name: "Bash", type: "bash", iconClass: "bash" }
            ]
        },
        {
            id: 14,
            name: "Presets",
            expanded: false,
            children: [
                {
                    id: 14,
                    name: "Gmail",
                    expanded: false,
                    children: [
                        { id: 15, name: "Send mail", type: "gmail-send", iconClass: "gmail-send" },
                        { id: 16, name: "Get mail", type: "gmail-receive", iconClass: "gmail-receive" }
                    ]
                },
                {
                    id: 17,
                    name: "Trello",
                    expanded: false,
                    children: [
                        { id: 18, name: "Create card", type: "trello-add-card", iconClass: "trello-add-card" },
                        { id: 19, name: "Remove card", type: "trello-remove-card", iconClass: "trello-remove-card" }
                    ]
                }
            ]
        }
    ]);
    const [objects] = useState([
        { id: 1, name: "Frame 1", expanded: false },
        // Adicione mais objetos conforme necessário
    ]);

    const updateComponent = (componentName) => {
        setCurrentComponent(componentName);
    };

    useEffect(() => {
        EventBus.on('change-component', updateComponent);
        return () => {
            EventBus.off('change-component', updateComponent);
        };
    }, []);

    return (
        <div className="flex h-full">
            <div className="bg w-10 flex-shrink-0">
                <QuickAccessBar />
            </div>

            <div className="flex-1 bg flex flex-col space-y-4 overflow-auto">
                {currentComponent === 'treeView' && (
                    <>
                        <h2 className="text font-semibold p-4" style={{ paddingBottom: '0px' }}>Components</h2>
                        <div className="flex flex-col h-full overflow-auto" style={{ paddingBottom: '0px' }}>
                            <div className="flex-1">
                                <div className="min-w-max">
                                    <TreeView treeData={logic} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {currentComponent === 'project' && (
                    <>
                        <h2 className="text font-semibold p-4" style={{ paddingBottom: '0px' }}>Project</h2>
                        <div className="flex flex-col h-full overflow-auto" style={{ paddingBottom: '0px' }}>
                            <div className="flex-1">
                                <div className="min-w-max">
                                    <Objects treeData={objects} />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ColumnOne;
