<template>
  <div class="p-8 flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="registerGuard" class="bg-white p-6 rounded shadow w-full max-w-md">
      <h3 class="text-lg font-bold mb-4">Registrar Guardia</h3>
      <input v-model="form.document" placeholder="Documento" class="w-full border mb-2 px-2 py-1" required />
      <input v-model="form.name" placeholder="Nombre" class="w-full border mb-2 px-2 py-1" required />
      <select v-model="form.shift" class="w-full border mb-2 px-2 py-1">
        <option value="mañana">Mañana</option>
        <option value="tarde">Tarde</option>
        <option value="noche">Noche</option>
      </select>
      <select v-model="form.status" class="w-full border mb-2 px-2 py-1">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
      <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full border mb-2 px-2 py-1" required />
      <div class="flex justify-end mt-4">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded">Registrar</button>
      </div>
      <div v-if="success" class="text-green-600 mt-2">Guardia registrado exitosamente</div>
      <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';

const form = ref({
  document: '',
  name: '',
  shift: 'mañana',
  status: 'activo',
  password: '',
});
const error = ref('');
const success = ref(false);

const registerGuard = async () => {
  error.value = '';
  success.value = false;
  try {
    await api.post('/guards/register', form.value);
    success.value = true;
    form.value = { document: '', name: '', shift: 'mañana', status: 'activo', password: '' };
    // Redirigir al login después de registrar
    setTimeout(() => {
      window.location.href = '/';
    }, 1200);
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar guardia';
  }
};
</script>
