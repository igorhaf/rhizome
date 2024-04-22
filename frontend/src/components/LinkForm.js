import React, { useState } from 'react';
import Text from './Text';
import Select from './Select';
import ActionButtonGroup from "./ActionButtonGroup";

function LinkForm() {


    return (
        <div className="w-full">
            <form>
                <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto"/>
                <Select
                    label="Frame link"
                    name="framelink"
                    options={[
                        {value: 'frame1', label: 'Frame 1'},
                        {value: 'frame2', label: 'Frame 2'},
                        {value: 'frame3', label: 'Frame 3'},
                        {value: 'frame4', label: 'Frame 4'},
                    ]}
                />
                <ActionButtonGroup />
            </form>
        </div>
    );
}

export default LinkForm;
