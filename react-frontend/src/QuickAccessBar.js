import React from 'react';
import './QuickAccessBar.css';

const QuickAccessBar = () => {
  return (
    <div className="quick-access-bar">
      <div className="logo"></div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons play"></div>
          <div className="overlay">
            <div className="text">Start</div>
          </div>
        </div>
      </div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons components"></div>
          <div className="overlay">
            <div className="text">Components</div>
          </div>
        </div>
      </div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons frames"></div>
          <div className="overlay">
            <div className="text">Frames</div>
          </div>
        </div>
      </div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons database"></div>
          <div className="overlay">
            <div className="text">Database</div>
          </div>
        </div>
      </div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons integrations"></div>
          <div className="overlay">
            <div className="text">Integrations</div>
          </div>
        </div>
      </div>
      <div className="image-container">
        <div className="icon-area">
          <div className="qm-icons config"></div>
          <div className="overlay">
            <div className="text">Config</div>
          </div>
        </div>
      </div>
      {/* ...adicione mais itens aqui conforme necessário... */}
    </div>
  );
};

export default QuickAccessBar;
