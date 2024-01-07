<template>
    <div @click="outsideClick" class="bg">
        <form @submit.prevent="handleSubmit">
            <input
                class="border text font bg p-0 form-input px-1 w-full"
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
