import React, { useState, useEffect, useContext } from 'react';
import ScheduleForm from './components/ScheduleForm'
import {useSelector} from "react-redux";
import Frames from "./Frames";
import SleepForm from "./components/SleepForm";
import IfForm from "./components/IfForm";
// Importe o componente StartTime que você converteu de StartTimeComponent.vue para React
// import StartTime from './GraphComponents/StartTime';

// Se você estiver usando um sistema de eventos global como o EventBus do Vue,
// você precisará substituí-lo por um contexto ou gerenciamento de estado global como Redux.
// Este é um exemplo de como você poderia criar um contexto se necessário.
// const EventBusContext = React.createContext();

const ColumnThree = () => {
  const activeFragments = useSelector(state => state.fragments.activeFragments);

  const [nodeName, setNodeName] = useState(null);
  const [nodeType, setNodeType] = useState(null);
  // Substitua a funcionalidade do EventBus pelo uso do contexto ou por um gerenciamento de estado global.
  // const EventBus = useContext(EventBusContext);

  useEffect(() => {
    // Aqui você configuraria seus ouvintes de eventos.
    // Substitua isso por ouvintes de contexto ou ações de Redux, conforme necessário.
    // Por exemplo:
    // const handleNodeSelected = EventBus.on('nodeSelected', (name) => {
    //   setNodeName(name);
    // });
    // const handleNodeType = EventBus.on('nodeType', (type) => {
    //   setNodeType(type);
    // });
    // return () => {
    //   // Limpando ouvintes ao desmontar o componente
    //   handleNodeSelected.unsubscribe();
    //   handleNodeType.unsubscribe();
    // };

  }, []);

  return (
    <div className="bg p-4 h-full overflow-auto">
      {nodeName ? (
        <p className="font font-semibold text">Nome do Objeto: {nodeType}</p>
      ) : (
          <>
            {activeFragments.includes('SleepForm') && <SleepForm />}
            {activeFragments.includes('ScheduleForm') && <ScheduleForm />}
            {activeFragments.includes('IfForm') && <IfForm />}
          </>
      )}
      {/* Substitua isso pelo seu componente StartTime convertido */}
      {/* <StartTime /> */}
    </div>
  );
};

export default ColumnThree;
