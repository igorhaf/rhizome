import React from 'react';
import './QuickAccessBar.css';
// Importe ou defina um EventBus equivalente em React, se necessário.

const QuickAccessBar = () => {
  return (
    <div className="quick-access-bar w-1/6">
      <div className="logo"></div>
      <div className="image-container">
        <div className="hover-area"></div>
        <div className="overlay">
          <div className="text">Igor</div>
        </div>
      </div>
      <div className="qm-icons play"></div>
      <div className="qm-icons components"></div>
      <div className="qm-icons frames"></div>
      <div className="qm-icons database"></div>
      <div className="qm-icons integrations"></div>
      <div className="qm-icons config"></div>
    </div>
  );
};

export default QuickAccessBar;