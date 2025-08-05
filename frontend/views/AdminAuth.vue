<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-green-300">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">Autenticación de Administrador</h2>
      <form @submit.prevent="authAdmin">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Usuario Admin</label>
          <input v-model="adminUser" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Usuario administrador" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Clave Admin</label>
          <input v-model="adminPass" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Contraseña administrador" />
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105 shadow-lg">
          Autorizar
        </button>
        <div v-if="adminError" class="mt-4 text-red-600 text-center font-semibold animate-pulse">
          {{ adminError }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../src/api'

const route = useRoute()
const router = useRouter()
const adminUser = ref('')
const adminPass = ref('')
const adminError = ref('')

const guardData = route.query

async function authAdmin() {
  try {
    await api.post('/admins/login', {
      username: adminUser.value,
      password: adminPass.value
    })
    adminError.value = ''
    // Registrar guardia
    await api.post('/guards/register', guardData)
    router.replace({ path: '/registrar-guardia', query: {}, state: {} })
    alert('Guardia registrado exitosamente')
  } catch (e) {
    adminError.value = 'Credenciales de administrador incorrectas'
  }
}
</script>
