<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h2 class="text-xl font-bold mb-6">Registrar Administrador</h2>
    <form @submit.prevent="registerAdmin" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre de usuario</label>
        <input v-model="form.username" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input v-model="form.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md font-semibold">Registrar</button>
      <div v-if="success" class="text-green-600 mt-2">Administrador registrado exitosamente</div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import api from '../src/api'
const form = ref({
  username: '',
  password: ''
})
const success = ref(false)
const error = ref('')
async function registerAdmin() {
  try {
    await api.post('/admins/register', form.value)
    success.value = true
    error.value = ''
    form.value = { username: '', password: '' }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al registrar administrador'
    success.value = false
  }
}
</script> 