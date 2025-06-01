const categories = [
  {
    id: 'communication',
    label: 'Communication',
    nodes: ['email']
  },
  {
    id: 'data',
    label: 'Data',
    nodes: ['spreadsheet']
  }
];

export const nodeTypes = [
  {
    type: 'email',
    label: 'Email',
    icon: 'email',
    group: 'Advanced/Actions/Communication',
    description: 'Send emails with templates and attachments'
  },
  {
    type: 'spreadsheet',
    label: 'Spreadsheet',
    icon: 'spreadsheet',
    group: 'Advanced/Actions/Data',
    description: 'Read, write and manipulate spreadsheet data'
  }
]; 