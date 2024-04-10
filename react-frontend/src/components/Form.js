// Form.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Text from './Text';
import Select from './Select';
import Textarea from './Textarea';

function Form() {
    const [conditions, setConditions] = useState([
        { id: 'cond-0', value1: '', operator: 'equal', value2: '' }
    ]);

    const addCondition = () => {
        setConditions([
            ...conditions,
            { id: `cond-${conditions.length}`, value1: '', operator: 'equal', value2: '' }
        ]);
    };

    const removeCondition = index => {
        setConditions(conditions.filter((_, idx) => idx !== index));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(conditions);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setConditions(items);
    };

    return (

            <div className="w-full">
                <form>
                    <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto" />
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="conditions">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {conditions.map((condition, index) => (
                                        <Draggable key={condition.id} draggableId={condition.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="flex items-center mb-4"
                                                >
                                                    {/* Substitua por ícone de arrastar */}
                                                    <span className="mr-1 p-0.5 rounded bg-gray-500 text-white">::</span>
                                                    <Text label="Variável 1" name={`value1_${index}`} placeholder="Primeira variável de comparação" />
                                                    <Select
                                                        label="Operador"
                                                        name={`operator_${index}`}
                                                        options={[
                                                            { value: 'equal', label: '==' },
                                                            { value: 'different', label: '!=' },
                                                        ]}
                                                    />
                                                    <Text label="Variável 2" name={`value2_${index}`} placeholder="Segunda variável de comparação" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeCondition(index)}
                                                        className="ml-1 p-0.5 rounded bg-red-500 text-white"
                                                    >
                                                        {/* Substitua por ícone de menos */}
                                                        ➖
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={addCondition}
                                                        className="ml-1 p-0.5 rounded bg-green-500 text-white"
                                                    >
                                                        {/* Substitua por ícone de mais */}
                                                        ➕
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <Textarea label="Condicional complexa" name="complex_conditional" placeholder="Condicionais com aninhamentos, subcondições, etc.." />
                    <Select
                        label="Log local"
                        name="local_log"
                        options={[
                            { value: 'disabled', label: 'Desabilitado' },
                            { value: 'enabled', label: 'Habilitado' },
                        ]}
                    />
                    <Select
                        label="Log global"
                        name="global_log"
                        options={[
                            { value: 'disabled', label: 'Desabilitado' },
                            { value: 'enabled', label: 'Habilitado' },
                        ]}
                    />
                </form>
            </div>

    );
}

export default Form;
