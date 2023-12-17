<template>
    <div @click="outsideClick">
        <form @submit.prevent="handleSubmit">
            <input
                class="border rounded-md p-2"
                v-model="textValue"
                @blur="handleBlur"
                :placeholder="placeholder"
            />
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            textValue: "",
        };
    },
    props: {
        placeholder: {
            type: String,
            default: 'Placeholder padrão'
        }
    },
    methods: {
        handleSubmit() {
            // Aqui vai sua lógica para tratar o envio do formulário
            //console.log(this.textValue);
        },
        handleBlur() {
            this.handleSubmit();
        },
        outsideClick(event) {
            // Se o clique foi fora do input, trata como um envio do formulário
            if (!this.$el.contains(event.target)) {
                this.handleSubmit();
            }
        }
    },
    mounted() {
        document.addEventListener("click", this.outsideClick);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.outsideClick);
    }
};
</script>
