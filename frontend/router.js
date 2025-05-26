import { createRouter, createWebHistory } from 'vue-router';
import Login from './views/Login.vue';
import Dashboard from './views/Dashboard.vue';
import Users from './views/Users.vue';
import Guards from './views/Guards.vue';
import Admins from './views/Admins.vue';
import Equipments from './views/Equipments.vue';
import History from './views/History.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/users', name: 'Users', component: Users },
  { path: '/guards', name: 'Guards', component: Guards },
  { path: '/admins', name: 'Admins', component: Admins },
  { path: '/equipments', name: 'Equipments', component: Equipments },
  { path: '/history', name: 'History', component: History },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
