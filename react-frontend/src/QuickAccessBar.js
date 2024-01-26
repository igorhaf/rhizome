import React from 'react';
import './QuickAccessBar.css';
// Importe ou defina um EventBus equivalente em React, se necessário.

const QuickAccessBar = ({ onComponentChange }) => {
  const showComponent = (componentName) => {
    // Aqui você pode usar um EventBus ou chamar um método passado como prop para o componente.
    // Por exemplo, se você passar um método 'onComponentChange' como prop:
    onComponentChange(componentName);
  };

  return (
    <div className="quick-access-bar w-1/6">
      <div onClick={() => showComponent('treeView')} className="logo"></div>
      <div onClick={() => showComponent('treeView')} className="qm-icons play"></div>
      <div onClick={() => showComponent('treeView')} className="qm-icons components"></div>
      <div onClick={() => showComponent('project')} className="qm-icons frames"></div>
      <div onClick={() => showComponent('treeView')} className="qm-icons database"></div>
      <div onClick={() => showComponent('project')} className="qm-icons integrations"></div>
      <div onClick={() => showComponent('project')} className="qm-icons config"></div>
    </div>
  );
};

export default QuickAccessBar;