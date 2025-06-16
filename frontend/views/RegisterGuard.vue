<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <h2 class="text-xl font-bold mb-6">Registrar Guardia</h2>
    <form @submit.prevent="registerGuard" class="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre</label>
        <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Documento</label>
        <input v-model="form.document" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Turno</label>
        <select v-model="form.shift" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="mañana">Mañana</option>
          <option value="tarde">Tarde</option>
          <option value="noche">Noche</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Estado</label>
        <select v-model="form.status" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
        <input v-model="form.password" type="password" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold">Registrar</button>
      <div v-if="success" class="text-green-600 mt-2">Guardia registrado exitosamente</div>
      <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>
    </form>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import axios from 'axios'
const form = ref({
  name: '',
  document: '',
  shift: 'mañana',
  status: 'activo',
  password: ''
})
const success = ref(false)
const error = ref('')
async function registerGuard() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL.replace('/api','')}/api/guards/register`, form.value)
    success.value = true
    error.value = ''
    form.value = { name: '', document: '', shift: 'mañana', status: 'activo', password: '' }
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al registrar guardia'
    success.value = false
  }
}
</script> 