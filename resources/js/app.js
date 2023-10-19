//require('./bootstrap');
import { createApp } from 'vue';
import MainLayout from "./components/MainLayout.vue";
import { store } from './store';

const app = createApp(MainLayout); // Use o MainLayout como o componente raiz

app.use(store); // Aqui você adiciona o Vuex store ao aplicativo

app.mount('#app');
