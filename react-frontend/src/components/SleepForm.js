// Form.js
import React, { useState } from 'react';
import Text from './Text';
import Select from './Select';
import TagsInput from "./TagsInput";

function SleepForm() {

    return (

        <div className="w-full">
            <form>
                <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto"/>
                <Text label="Duração" name="duration" placeholder="Tempo em minutos"/>
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
            </form>
        </div>

    );
}

export default SleepForm;
