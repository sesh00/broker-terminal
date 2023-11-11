import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from "./store";
import 'chart.js/auto';
import VueApexCharts from "vue3-apexcharts";

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VueApexCharts)
app.config.globalProperties.$axios = axios;
app.mount('#app');
