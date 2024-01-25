// ColumnOne.jsx
import React from 'react';
// Importe seus componentes React equivalentes aqui
// import TreeView from './TreeView';
// import Objects from './Objects';
// import QuickAccessBar from './QuickAccessBar';

const ColumnOne = () => {
  // Dados fictícios para a visualização estática
  const logic = [
        {
            id: 1,
            name: "Core",
            expanded: true,
            children: [
                {
                    id: 2,
                    name: "Start",
                    type: "start",
                    iconClass: "start"
                },
                {
                    id: 3,
                    name: "Schedule",
                    type: "schedule",
                    iconClass: "schedule"
                },
                {
                    id: 4,
                    name: "If",
                    type: "if",
                    iconClass: "if"
                },
                {
                    id: 5,
                    name: "Switch",
                    type: "switch",
                    iconClass: "switch"
                },
                {
                    id: 6,
                    name: "Sleep",
                    type: "sleep",
                    iconClass: "sleep"
                },
                {
                    id: 7,
                    name: "Start Time",
                    type: "starttime",
                    iconClass: "starttime"
                },
                {
                    id: 8,
                    name: "Webhook",
                    type: "webhook",
                    iconClass: "webhook"
                },
                {
                    id: 9,
                    name: "Api",
                    type: "api",
                    iconClass: "api"
                },
                {
                    id: 10,
                    name: "Exception",
                    type: "exception",
                    iconClass: "exception"
                },
                {
                    id: 11,
                    name: "Link",
                    type: "link",
                    iconClass: "link"
                },
                {
                    id: 12,
                    name: "Stop",
                    type: "stop",
                    iconClass: "stop"
                },
                {
                    id: 13,
                    name: "Query",
                    type: "query",
                    iconClass: "query"

                },
                {
                    id: 30,
                    name: "Javascript",
                    type: "javascript",
                    iconClass: "javascript"

                },
                {
                    id: 50,
                    name: "Bash",
                    type: "bash",
                    iconClass: "bash"

                }
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
                        {
                            id: 15,
                            name: "Send mail",
                            type: "gmail-send",
                            iconClass: "gmail-send"
                        },
                        {
                            id: 16,
                            name: "Get mail",
                            type: "gmail-receive",
                            iconClass: "gmail-receive"
                        }
                    ]
                },
                {
                    id: 17,
                    name: "Trello",
                    expanded: false,
                    children: [
                        {
                            id: 18,
                            name: "Create card",
                            type: "trello-add-card",
                            iconClass: "trello-add-card"
                        },
                        {
                            id: 19,
                            name: "Remove card",
                            type: "trello-remove-card",
                            iconClass: "trello-remove-card"
                        }
                    ]
                }
            ]
        }
    ];
    const objects = [{
            id: 1,
            name: "Frame 1",
            expanded: false,
        },
    ];

  return (
    <div className="flex h-full">
      <div className="bg w-10 flex-shrink-0">
        {/* Substitua por seu componente QuickAccessBar, se aplicável */}
        {/* <QuickAccessBar /> */}
      </div>
      <div className="flex-1 bg flex flex-col space-y-4 overflow-auto">
        {/* Substitua "treeView" pelo estado correspondente, se necessário */}
        {true && (
          <>
            <h2 className="text font-semibold p-4" style={{ paddingBottom: '0px' }}>Components</h2>
            <div className="flex flex-col h-full overflow-auto" style={{ paddingBottom: '0px' }}>
              <div className="flex-1">
                <div className="min-w-max">
                  {/* Substitua por seu componente TreeView, se aplicável */}
                  {/* <TreeView treeData={logic} /> */}
                </div>
              </div>
            </div>
          </>
        )}
        {/* Substitua "project" pelo estado correspondente, se necessário */}
        {false && (
          <>
            <h2 className="text font-semibold p-4" style={{ paddingBottom: '0px' }}>Project</h2>
            <div className="flex flex-col h-full overflow-auto" style={{ paddingBottom: '0px' }}>
              <div className="flex-1">
                <div className="min-w-max">
                  {/* Substitua por seu componente Objects, se aplicável */}
                  {/* <Objects treeData={objects} /> */}
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
