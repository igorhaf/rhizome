import React from 'react';
import { useDispatch } from 'react-redux';
import { addFragment } from './redux/actions/fragmentActions';

import './QuickAccessBar.css';

const QuickAccessBar = () => {
  const dispatch = useDispatch();
  
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
      <div className="icon-area"  onClick={() => dispatch(addFragment('Elements'))}>
          <div className="qm-icons components"></div>
          <div className="overlay">
              <div className="text">Elements</div>
          </div>
      </div>
      </div>
      <div className="image-container">
        <div className="icon-area"  onClick={() => dispatch(addFragment('Frames'))}>
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
            <div className="text" >Database</div>
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
