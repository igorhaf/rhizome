import { createApp } from 'vue'
import App from './App.vue'
import './styles/app.css'; // Here
import { InstallCodemirro } from "codemirror-editor-vue3";
import VueGoodTablePlugin from 'vue-good-table-next';
import 'vue-good-table-next/dist/vue-good-table-next.css'


const app = createApp(App);
app.use(VueGoodTablePlugin);
app.use(InstallCodemirro);
app.mount("#app");
