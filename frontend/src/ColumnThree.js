import React, { useState, useEffect, useContext } from 'react';
import ScheduleForm from './components/ScheduleForm'
import {useSelector} from "react-redux";
import SleepForm from "./components/SleepForm";
import IfForm from "./components/IfForm";
import LinkForm from "./components/LinkForm";
import QueryForm from "./components/QueryForm";

// Importe o componente StartTime que você converteu de StartTimeComponent.vue para React
// import StartTime from './GraphComponents/StartTime';

// Se você estiver usando um sistema de eventos global como o EventBus do Vue,
// você precisará substituí-lo por um contexto ou gerenciamento de estado global como Redux.
// Este é um exemplo de como você poderia criar um contexto se necessário.
// const EventBusContext = React.createContext();

const ColumnThree = () => {
  const activeForms = useSelector(state => state.forms.activeForms);

  const [nodeName, setNodeName] = useState(null);
  const [nodeType, setNodeType] = useState(null);

  return (
    <div className="bg p-4 h-full overflow-auto">
      {nodeName ? (
        <p className="font font-semibold text">Nome do Objeto: {nodeType}</p>
      ) : (
          <>
            {activeForms.includes('SleepForm') && <SleepForm />}
            {activeForms.includes('ScheduleForm') && <ScheduleForm />}
            {activeForms.includes('IfForm') && <IfForm />}
            {activeForms.includes('LinkForm') && <LinkForm />}
            {activeForms.includes('QueryForm') && <QueryForm />}
          </>
      )}
    </div>
  );
};

export default ColumnThree;
