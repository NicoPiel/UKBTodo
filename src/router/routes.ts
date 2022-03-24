import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    },

    {
        path: '/todo/new',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/NewTodoPage.vue') }],
    },

    {
        path: '/todo/:id/edit',
        component: () => import('layouts/MainLayout.vue'),
        children: [{ path: '', component: () => import('pages/EditTodoPage.vue') }],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue'),
    },
];

export default routes;
