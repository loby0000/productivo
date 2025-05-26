<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <button @click="logout" class="bg-red-600 text-white px-4 py-2 rounded">Cerrar sesión</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <router-link to="/users" class="block bg-blue-100 p-4 rounded shadow hover:bg-blue-200">Gestión de Usuarios</router-link>
      <router-link to="/guards" class="block bg-green-100 p-4 rounded shadow hover:bg-green-200">Gestión de Guardias</router-link>
      <router-link to="/admins" class="block bg-yellow-100 p-4 rounded shadow hover:bg-yellow-200">Gestión de Administradores</router-link>
      <router-link to="/equipments" class="block bg-purple-100 p-4 rounded shadow hover:bg-purple-200">Gestión de Equipos</router-link>
      <router-link to="/history" class="block bg-gray-100 p-4 rounded shadow hover:bg-gray-200">Historial de Entradas y Salidas</router-link>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

function logout() {
  localStorage.removeItem('token');
  router.push('/');
}
</script>
