import React from 'react';
import { useSelector } from 'react-redux';
import Elements from './Elements';
import Frames from './Frames';
import QuickAccessBar from './QuickAccessBar';

const ColumnOne = () => {
   const activeFragments = useSelector(state => state.fragments.activeFragments);

  const elements = [
      {
          id: 2,
          name: "Start",
          type: "start",
          iconClass: "start"
      }, {
            id: 1,
            name: "Core",
            expanded: true,
            children: [
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
    const frames = [
        {
            id: 2,
            name: "Frame 1",
            type: "frame",
            iconClass: ""
        },{
            id: 19,
            name: "Frame 2",
            type: "frame",
            iconClass: ""
        },{
            id: 20,
            name: "Frame 3",
            type: "frame",
            iconClass: ""
        }
    ];

    return (
      <div className="flex h-full">
          <div className="bg w-10 flex-shrink-0">
              <QuickAccessBar />
          </div>
          <div className="flex-1 bg flex flex-col space-y-4 overflow-auto">
              {activeFragments.includes('Elements') && <Elements elements={elements} />}
              {activeFragments.includes('Frames') && <Frames frames={frames} />}
          </div>
      </div>
  );
};

export default ColumnOne;
