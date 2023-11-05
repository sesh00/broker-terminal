import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/components/Login.vue';
import MainPage from '@/components/MainPage.vue';
import AdminPage from '@/components/AdminPage.vue';

const routes = [
    {
        path: '/',
        component: Login,
    },
    {
        path: '/main',
        component: MainPage,
    },
    {
        path: '/admin',
        component: AdminPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
