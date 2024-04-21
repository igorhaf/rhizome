import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Text from './Text';
import Select from './Select';
import Textarea from './Textarea';
import TagsInput from "./TagsInput";
import ActionButtonGroup from "./ActionButtonGroup";

function IfForm() {
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
                <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto"/>
                <label className="block mb-1 text-primary">
                    Condicionais
                </label>
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
                                                className="flex items-center mb-1"
                                            >
                                                <span className="mr-1 p-0.5 rounded bg text">🟰</span>
                                                <Text name={`value1_${index}`}
                                                      placeholder="Primeira variável de comparação"/>
                                                <Select
                                                    width={`w-32`}
                                                    name={`operator_${index}`}
                                                    options={[
                                                        {"value": "equal", "label": "=="},
                                                        {"value": "different", "label": "!="},
                                                        {"value": "greater", "label": ">"},
                                                        {"value": "less", "label": "<"},
                                                        {"value": "greater_equal", "label": ">="},
                                                        {"value": "less_equal", "label": "<="},
                                                        {"value": "and", "label": "and"},
                                                        {"value": "or", "label": "or"},
                                                        {"value": "not", "label": "not"},
                                                        {"value": "is", "label": "is"},
                                                        {"value": "is_not", "label": "is not"},
                                                        {"value": "in", "label": "in"},
                                                        {"value": "not_in", "label": "not in"}
                                                    ]}
                                                />
                                                <Text name={`value2_${index}`}
                                                      placeholder="Segunda variável de comparação"/>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCondition(index)}
                                                    className="ml-1 p-0.5 rounded bg text"
                                                >
                                                    ➖
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={addCondition}
                                                    className="ml-1 p-0.5 rounded bg text"
                                                >
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
                <Textarea label="Condicional complexa" name="complex_conditional"
                          placeholder="Condicionais com aninhamentos, subcondições, etc.."/>
                <Select
                    label="Log local"
                    name="local_log"
                    options={[
                        {value: 'disabled', label: 'Desabilitado'},
                        {value: 'enabled', label: 'Habilitado'},
                    ]}
                />
                <Select
                    label="Log global"
                    name="global_log"
                    options={[
                        {value: 'disabled', label: 'Desabilitado'},
                        {value: 'enabled', label: 'Habilitado'},
                    ]}
                />
                <TagsInput label={'Email-s de alerta'}/>
                <ActionButtonGroup />
            </form>
        </div>
    );
}

export default IfForm;
