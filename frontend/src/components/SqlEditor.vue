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
import "codemirror/mode/sql/sql";
// placeholder
import "codemirror/addon/display/placeholder.js";
// theme
import "codemirror/theme/dracula.css";

import { ref } from "vue";
export default {
    components: { Codemirror },
    setup() {
        const code = ref(`SELECT * FROM usuarios WHERE idade > 18;`);

        return {
            code,
            cmOptions: {
                mode: "text/x-pgsql", // Language mode
                theme: "dracula", // Theme
            },
        };
    },
};
</script>
