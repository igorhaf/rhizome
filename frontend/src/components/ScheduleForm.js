// Form.js
import React, { useState } from 'react';
import Text from './Text';
import Select from './Select';
import TagsInput from "./TagsInput";
import TimeInput from "./TimeInput";
import DateInput from "./DateInput";
import ActionButtonGroup from "./ActionButtonGroup";

function ScheduleForm() {
    const [time, setTime] = useState('');
    const [date, setDate] = useState('');

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    return (
        <div className="w-full">
            <form>
                <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto"/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TimeInput label="Hora de início:" value={time} onChange={handleTimeChange} style={{ marginRight: '10px', flex: 1 }} />
                    <DateInput label="Data de nascimento:" value={date} onChange={handleDateChange} style={{ flex: 1 }} />
                </div>
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

export default ScheduleForm;
