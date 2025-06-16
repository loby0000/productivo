import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './store/auth';
import Users from './views/Users.vue';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import Guards from './views/Guards.vue';
import Admins from './views/Admins.vue';
import Equipments from './views/Equipments.vue';
import History from './views/History.vue';
import RegisterSelector from './views/RegisterSelector.vue'
import RegisterGuard from './views/RegisterGuard.vue'
import RegisterAdmin from './views/RegisterAdmin.vue'
import RegisterAdminGuardTabs from './views/RegisterAdminGuardTabs.vue'

const routes = [
  {
    path: '/registro',
    name: 'RegisterAdminGuardTabs',
    component: RegisterAdminGuardTabs,
    meta: { requiresAuth: false, title: 'Registro de Guardias y Administradores' }
  },
  {
    path: '/',
    name: 'RegisterSelector',
    component: RegisterSelector,
    meta: { requiresAuth: false, title: 'Registro de Guardias y Administradores' }
  },
  {
    path: '/register-guard',
    name: 'RegisterGuard',
    component: RegisterGuard,
    meta: { requiresAuth: false, title: 'Registrar Guardia' }
  },
  {
    path: '/register-admin',
    name: 'RegisterAdmin',
    component: RegisterAdmin,
    meta: { requiresAuth: false, title: 'Registrar Administrador' }
  },
  {
    path: '/',
    name: 'Users',
    component: Users,
    meta: {
      requiresAuth: false,
      title: 'Registro de Usuarios'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      roles: ['admin', 'guard']
    }
  },
  {
    path: '/guards',
    name: 'Guards',
    component: Guards,
    meta: {
      requiresAuth: true,
      title: 'Gestión de Guardias',
      roles: ['admin']
    }
  },
  {
    path: '/admins',
    name: 'Admins',
    component: Admins,
    meta: {
      requiresAuth: true,
      title: 'Gestión de Administradores',
      roles: ['admin']
    }
  },
  {
    path: '/equipments',
    name: 'Equipments',
    component: Equipments,
    meta: {
      requiresAuth: true,
      title: 'Gestión de Equipos',
      roles: ['admin', 'guard']
    }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: {
      requiresAuth: true,
      title: 'Historial',
      roles: ['admin', 'guard']
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('./views/NotFound.vue'),
    meta: {
      requiresAuth: false,
      title: 'Página no encontrada'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles || [];
  document.title = `${to.meta.title} - Control de Acceso SENA`;

  if (!requiresAuth) {
    if (authStore.token && to.path === '/login') {
      next('/dashboard');
    } else {
      next();
    }
    return;
  }

  const isAuthenticated = authStore.token ? await authStore.checkAuth() : false;
  if (!isAuthenticated) {
    next('/login');
    return;
  }
  if (requiredRoles.length && !requiredRoles.includes(authStore.userType)) {
    next('/dashboard');
    return;
  }
  next();
});

export default router;
