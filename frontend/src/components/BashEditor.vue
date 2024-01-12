<template>
    <Codemirror
        v-model:value="code"
        :options="cmOptions"
        border
        placeholder="test placeholder"
        :height="200"
        @change="change"
    />
</template>

<script>
import Codemirror from "codemirror-editor-vue3";

// placeholder
import "codemirror/addon/display/placeholder.js";

// language
import "codemirror/mode/shell/shell.js";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/dracula.css";

import { ref } from "vue";
export default {
    components: { Codemirror },
    setup() {
        const code = ref(`# !/bin/bash

# Exibe uma mensagem
echo "Listando todos os arquivos e diretórios:"

# Lista todos os arquivos e diretórios no diretório atual
ls -l

# Exibe uma linha em branco para separação
echo

# Exibe a data e hora atuais
echo "Data e hora atuais:"
date
`);

        return {
            code,
            cmOptions: {
                mode: "text/x-sh", // Language mode
                theme: "dracula", // Theme
            },
        };
    },
};
</script>
