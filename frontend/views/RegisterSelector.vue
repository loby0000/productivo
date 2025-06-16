<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h1 class="text-2xl font-bold mb-8">Registro de Guardias y Administradores</h1>
    <div class="flex space-x-8">
      <button @click="goTo('guard')" class="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl">Registrar Guardia</button>
      <button @click="goTo('admin')" class="bg-green-600 text-white px-8 py-4 rounded-lg text-xl">Registrar Administrador</button>
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goTo(type) {
  if (type === 'guard') router.push('/register-guard')
  if (type === 'admin') router.push('/register-admin')
}
</script> 