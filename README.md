# Rhizome - Low-Code Development Platform

Rhizome is a low-code development platform similar to OutSystems, built with Next.js. It allows you to create applications using a visual flowchart-based interface.

## Features

- Visual flowchart-based development
- Drag-and-drop interface
- Multiple node types (Start, End, Action, Decision, Loop, Subprocess, Data, API)
- Real-time property editing
- BPMN-like workflow rules
- Modern and intuitive UI

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rhizome-app.git
cd rhizome-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Adding Nodes**
   - Drag nodes from the left toolbar onto the canvas
   - Click on a node type in the toolbar to add it to the center of the canvas

2. **Connecting Nodes**
   - Click and drag from one node's connection point to another
   - Different types of connections (success, error, conditional) are available

3. **Editing Properties**
   - Click on a node to select it
   - Edit its properties in the right panel
   - Properties include label, description, and type-specific settings

4. **Canvas Navigation**
   - Pan: Hold Alt + Left click and drag
   - Zoom: Use mouse wheel
   - Reset view: Double click on empty canvas

## Node Types

- **Start**: Beginning of a process
- **End**: End of a process
- **Action**: Perform an operation
- **Decision**: Branch based on conditions
- **Loop**: Repeat operations
- **Subprocess**: Group of related operations
- **Data**: Data operations
- **API**: External service integration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
