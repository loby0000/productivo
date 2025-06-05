import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './store/auth';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import Users from './views/Users.vue';
import Guards from './views/Guards.vue';
import Admins from './views/Admins.vue';
import Equipments from './views/Equipments.vue';
import History from './views/History.vue';

const routes = [
  { 
    path: '/', 
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
    path: '/users', 
    name: 'Users', 
    component: Users,
    meta: { 
      requiresAuth: true,
      title: 'Gestión de Usuarios',
      roles: ['admin']
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
  // Ruta para manejar 404
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

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.roles || [];
  
  // Actualizar el título de la página
  document.title = `${to.meta.title} - Control de Acceso SENA`;

  if (!requiresAuth) {
    // Si la ruta no requiere autenticación, permitir
    if (authStore.token && to.path === '/') {
      // Si está autenticado y va al login, redirigir al dashboard
      next('/dashboard');
    } else {
      next();
    }
    return;
  }

  // Verificar autenticación
  const isAuthenticated = authStore.token ? await authStore.checkAuth() : false;

  if (!isAuthenticated) {
    next('/');
    return;
  }

  // Verificar permisos
  if (requiredRoles.length && !requiredRoles.includes(authStore.userType)) {
    next('/dashboard');
    return;
  }

  next();
});

export default router;
