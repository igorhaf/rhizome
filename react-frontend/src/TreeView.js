import React, { useState } from 'react';
// Importe seus ícones do pacote react-icons ou onde eles estiverem disponíveis.
// Suponha que você tenha ícones equivalentes em React.
// import { FolderOpenIcon, FolderIcon, DocumentIcon } from 'some-icon-pack';

const TreeView = ({ treeData }) => {
  // Criação de um novo estado para armazenar os dados da árvore com a propriedade 'expanded'
  const [nodes, setNodes] = useState(treeData.map(node => ({ ...node, expanded: false })));

  // Função para alternar a visibilidade dos filhos de um nó
  const toggle = (node) => {
    setNodes(nodes.map(n => {
      if (n.id === node.id) {
        return { ...n, expanded: !n.expanded };
      }
      return n;
    }));
  };

  // Função para iniciar o arraste de um nó
  const startDrag = (event, node) => {
    event.dataTransfer.setData('nodeData', JSON.stringify(node));
  };

  return (
    <ul className="pl-4 space-y-2">
      {nodes.map(node => (
        <li key={node.id}>
          <div className="flex items-center space-x-2" onClick={() => toggle(node)}>
            <span>
              {node.children && node.children.length ? (
                node.expanded ? (
                  // Substitua pelos ícones de pasta aberta e fechada do seu pacote de ícones
                  // <FolderOpenIcon className="w-6 h-6 text-yellow-400" />
                  <span>[Pasta Aberta]</span>
                ) : (
                  // <FolderIcon className="w-6 h-6 text-yellow-400" />
                  <span>[Pasta Fechada]</span>
                )
              ) : (
                // Aqui, você renderizaria o ícone do documento ou outro ícone baseado na classe
                // <DocumentIcon className="w-6 h-6 text-yellow-400" />
                <div className={node.iconClass} draggable="true" onDragStart={(e) => startDrag(e, node)}>[Ícone]</div>
              )}
            </span>
            <span className="text">
              {node.name}
            </span>
          </div>
          {node.expanded && node.children && (
            <TreeView treeData={node.children} />
          )}
        </li>
      ))}
    </ul>
  );
};

export default TreeView;
