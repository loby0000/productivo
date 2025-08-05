<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-blue-300 to-blue-700">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <h1 class="text-4xl font-extrabold text-red-600 text-center mb-4">PRUEBA DE REGISTRO GUARDIA</h1>
      <h2 class="text-3xl font-bold text-center text-green-700 mb-6">Registro de Guardia</h2>
      <form @submit.prevent="goToAdminAuth">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Documento</label>
          <input v-model="form.document" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder="Ingrese el documento del guardia" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Nombre</label>
          <input v-model="form.name" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder="Ingrese el nombre del guardia" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Jornada</label>
          <select v-model="form.shift" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition">
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
            <option value="fin de semana">Fin de semana</option>
          </select>
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input v-model="form.password" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition" placeholder="Crea una contraseña" />
        </div>
        <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105 shadow-lg">
          Registrar Guardia
        </button>
        <div v-if="success" class="mt-4 text-green-600 text-center font-semibold animate-pulse">
          Guardia registrado exitosamente
        </div>
        <div v-if="error" class="mt-4 text-red-600 text-center font-semibold animate-pulse">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const form = ref({
  document: '',
  name: '',
  shift: 'mañana',
  password: '',
  status: 'activo' // Valor por defecto
})
const success = ref(false)
const error = ref('')
const router = useRouter()
function goToAdminAuth() {
  router.push({ path: '/autenticar-admin', query: { ...form.value } })
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>