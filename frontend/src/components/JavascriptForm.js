import React, { useState } from 'react';
import Text from './Text';
import TabButton from "./TabButton";

function JavascriptForm() {


    return (
        <div className="w-full">
            <form>
                <Text label="Nome do objeto" name="object_name" placeholder="Nome do objeto"/>
                <TabButton buttonText={"Abrir console"} />
            </form>
        </div>
    );
}

export default JavascriptForm;
