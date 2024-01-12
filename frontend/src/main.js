import { createApp } from 'vue'
import App from './App.vue'
import './styles/app.css'; // Here
import { InstallCodemirro } from "codemirror-editor-vue3";

const app = createApp(App);
app.use(InstallCodemirro);
app.mount("#app");
