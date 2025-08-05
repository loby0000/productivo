<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block mb-1">Usuario</label>
          <input v-model="user" type="text" required class="w-full px-4 py-2 border rounded-lg" placeholder="Usuario o documento" />
        </div>
        <div class="mb-6">
          <label class="block mb-1">Clave</label>
          <input v-model="pass" type="password" required class="w-full px-4 py-2 border rounded-lg" placeholder="Contraseña" />
        </div>
        <div class="flex gap-2 mb-4">
          <button type="button" @click="loginGuard" class="bg-blue-600 text-white px-4 py-2 rounded-lg w-1/2">Guardia</button>
          <button type="button" @click="loginAdmin" class="bg-green-600 text-white px-4 py-2 rounded-lg w-1/2">Admin</button>
        </div>
        <div v-if="error" class="text-red-600 text-center font-semibold">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const user = ref('')
const pass = ref('')
const error = ref('')

async function loginGuard() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/guards/login`, {
      document: user.value,
      password: pass.value
    })
    error.value = ''
    router.push('/formulario-guardia')
  } catch (e) {
    error.value = 'Credenciales incorrectas (guardia)'
  }
}

async function loginAdmin() {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/admins/login`, {
      username: user.value,
      password: pass.value
    })
    error.value = ''
    router.push('/formulario-guardia')
  } catch (e) {
    error.value = 'Credenciales incorrectas (admin)'
  }
}

function login() {
  // No hace nada, solo para evitar submit por enter
}
</script>
