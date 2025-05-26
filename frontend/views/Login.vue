<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
      <div class="mb-4">
        <label class="block mb-1">Usuario o Documento</label>
        <input v-model="username" type="text" class="w-full border rounded px-3 py-2" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Contraseña</label>
        <input v-model="password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Tipo de usuario</label>
        <select v-model="userType" class="w-full border rounded px-3 py-2">
          <option value="admin">Administrador</option>
          <option value="guard">Guardia</option>
        </select>
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Entrar</button>
      <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
      <div class="mt-6 text-center">
        <span>¿No estás registrado?</span>
        <button type="button" @click="goToRegister" class="text-blue-600 underline ml-1">Regístrate aquí</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const username = ref('');
const password = ref('');
const userType = ref('admin');
const error = ref('');
const router = useRouter();

const login = async () => {
  error.value = '';
  try {
    let endpoint = userType.value === 'admin' ? '/admins/login' : '/guards/login';
    const payload = userType.value === 'admin'
      ? { username: username.value, password: password.value }
      : { document: username.value, password: password.value };
    const res = await api.post(endpoint, payload);
    // Guardar token si es necesario
    localStorage.setItem('token', res.data.token);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al iniciar sesión';
  }
};

const goToRegister = () => {
  router.push('/guards');
};
</script>
