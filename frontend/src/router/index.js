import { createRouter, createWebHistory } from 'vue-router'
import LoginGuardiaVigilante from '../components/LoginGuardiaVigilante.vue'
// import Dashboard from '../views/Dashboard.vue'
import GuardForm from '../views/GuardForm.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginGuardiaVigilante
  },
  // Ruta dashboard eliminada para evitar acceso accidental
  // Rutas innecesarias eliminadas
  {
    path: '/formulario-guardia',
    name: 'GuardForm',
    component: GuardForm
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      role = payload.role;
    } catch (e) {
      // Token inválido o sin role, forzar como guardia
      role = null;
    }
  }

  // Si intenta ir al dashboard y no es admin, redirige SIEMPRE al formulario de guardia (comentado, ya no existe dashboard)
  if (to.path === '/users' && role !== 'admin') {
    return next('/formulario-guardia');
  }
  // Si intenta ir al formulario de guardia y es admin, redirige al dashboard (comentado, ya no existe dashboard)
  if (to.path === '/formulario-guardia' && role === 'admin') {
    return next('/users');
  }
  // Si no hay token y va a una ruta protegida, redirige al login
  if (!token && (to.path === '/users' || to.path === '/formulario-guardia')) {
    return next('/');
  }
  next();
});

export default router