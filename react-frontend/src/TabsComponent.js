import React, { useState, useRef, useEffect } from 'react';
import './TabsComponent.css';

const TabsComponent = ({ tabsProp, activeTabProp, onTabChanged, onTabAdded }) => {
  const [tabs, setTabs] = useState(tabsProp || []);
  const [activeTab, setActiveTab] = useState(activeTabProp || 0);
  const [nextTabId, setNextTabId] = useState(tabs.length + 1);
  const tabInputRef = useRef(null);

  useEffect(() => {
    if (tabs.length > 0) {
      setNextTabId(Math.max(...tabs.map(tab => tab.id)) + 1);
    }
  }, [tabs]);

  const changeTab = (index) => {
    setActiveTab(index);
    if (onTabChanged) {
      onTabChanged(index);
    }
  };

  const addTab = () => {
    const nextTab = {
      id: nextTabId,
      label: `Frame ${nextTabId}`,
      content: 'MxGraphComponent',
      isEditing: false
    };
    setTabs([...tabs, nextTab]);
    setActiveTab(tabs.length);
    setNextTabId(nextTabId + 1);
    if (onTabAdded) {
      onTabAdded(nextTab);
    }
    // Implementar EventBus.emit('add-frame', nextTab.label);
  };

  const enableEdit = (tab) => {
    const updatedTabs = tabs.map(t => {
      if (t.id === tab.id) {
        return { ...t, isEditing: true };
      }
      return t;
    });
    setTabs(updatedTabs);
  };

  const saveTabName = (tab) => {
    const updatedTabs = tabs.map(t => {
      if (t.id === tab.id) {
        return { ...t, isEditing: false };
      }
      return t;
    });
    setTabs(updatedTabs);
  };

  const closeTab = (index) => {
    const updatedTabs = [...tabs];
    updatedTabs.splice(index, 1);
    setTabs(updatedTabs);
    setActiveTab(Math.max(0, activeTab - 1));
    // Implementar EventBus.emit('tabClosed', index);
    if (onTabChanged) {
      onTabChanged(activeTab);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs-wrapper">
        <div onClick={addTab} className="add-tab">+</div>
        {tabs.map((tab, index) => (
          <div key={tab.id} className={`tab ${activeTab === index ? 'active-tab' : ''}`}
               onClick={() => changeTab(index)}>
            {tab.isEditing ? (
              <input ref={tabInputRef} value={tab.label} onChange={(e) => saveTabName({ ...tab, label: e.target.value })} onBlur={() => saveTabName(tab)} className="tab-input" />
            ) : (
              <span>{tab.label}</span>
            )}
            <span onClick={(e) => { e.stopPropagation(); closeTab(index); }} className="close-btn">X</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabsComponent;