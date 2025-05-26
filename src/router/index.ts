import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

interface CustomRouteMeta {
  title?: string;
  icon?: string;
  hidden?: boolean;
}

declare module 'vue-router' {
  interface RouteMeta extends CustomRouteMeta {}
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../components/layout/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('../views/users/index.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/products/index.vue'),
        meta: { title: '产品管理', icon: 'ShoppingCart' }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { hidden: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: { hidden: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
