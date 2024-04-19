import React, {useEffect, useState} from 'react';
// Importe os componentes React equivalentes aqui
import MxGraphComponent from './MxGraphComponent';
import TabsComponent from './TabsComponent';
import {useSelector} from "react-redux";
import Frames from "./Frames";

const ColumnTwo = () => {
  const activeGraphs = useSelector(state => state.graphs.activeGraphs);
  // Definindo o estado inicial para as abas e a aba ativa
  const [tabs, setTabs] = useState([
    {
      id: 1,
      label: 'Tab 1',
      content: 'Conteúdo da Tab 1',
      graphData: null
    }
  ]);
  const [activeTab, setActiveTab] = useState(0);

  // Manipuladores para mudanças nas abas
  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const handleTabAdded = () => {
    const newTabId = tabs.length + 1;
    const nextTab = {
      id: newTabId,
      graphData: null
    };
    setTabs([...tabs, nextTab]);
    setActiveTab(tabs.length); // Define a nova aba como ativa
  };
  
  return (
    <div className="bg-white p">
      {/* Substitua por seu componente TabsComponent, se aplicável */}
      <TabsComponent tabs={tabs} activeTab={activeTab} onTabAdded={handleTabAdded} onTabChanged={handleTabChange} />
      
      {/* Substitua os componentes comentados por seus equivalentes em React, se aplicável */}
      {/* <Database /> */}
      {/* <JavascriptEditor /> */}
      {/* <SqlEditor /> */}
      {/* <BashEditor /> */}

      {tabs.map((tab, index) => (
        activeTab === index && (
          <div key={tab.id} style={{ display: activeTab === index ? 'block' : 'none' }}>
            {/* Substitua por seu componente MxGraphComponent, se aplicável */}
{/*
            <MxGraphComponent graphContent={tab.content} onNodeSelected={handleNodeSelected} />
*/}
            {activeGraphs.includes('MxGraph') && <MxGraphComponent />}
          </div>
        )
      ))}
    </div>
  );
};

export default ColumnTwo;
