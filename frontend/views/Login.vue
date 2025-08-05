<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de usuario</label>
        <select v-model="tab" class="input">
          <option value="guard">Guardia</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div v-if="tab==='guard'">
          <label class="block text-sm font-medium text-gray-700">Documento</label>
          <input v-model="form.document" class="input" autocomplete="username" />
          <span class="text-red-500 text-xs">{{ errors.document }}</span>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700">Jornada</label>
            <select v-model="form.shift" class="input">
              <option value="">Seleccione una jornada</option>
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
              <option value="noche">Noche</option>
              <option value="fin de semana">Fin de semana</option>
            </select>
            <span class="text-red-500 text-xs">{{ errors.shift }}</span>
          </div>
        </div>
        <div v-else>
          <label class="block text-sm font-medium text-gray-700">Usuario Admin</label>
          <input v-model="form.username" class="input" autocomplete="username" />
          <span class="text-red-500 text-xs">{{ errors.username }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Clave</label>
          <input v-model="form.password" type="password" class="input" autocomplete="current-password" />
          <span class="text-red-500 text-xs">{{ errors.password }}</span>
        </div>
        <!-- Eliminado campo de código de verificación para admin -->
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center" :disabled="loading">
          <span v-if="loading" class="loader mr-2"></span>
          Iniciar Sesión
        </button>
        <div v-if="errorMsg" class="text-red-600 text-sm text-center mt-2">{{ errorMsg }}</div>
        <div class="text-center mt-4">
          <span class="text-gray-600 text-sm">¿No tienes cuenta?</span>
          <router-link to="/registro" class="text-blue-600 hover:underline ml-1 text-sm">Registrarse</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '../store/auth'

const tab = ref('guard')
// Eliminado show2FA, ya no se usa 2FA para admin
const loading = ref(false)
const errorMsg = ref('')

const activeTabClass = 'flex-1 py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold focus:outline-none'
const inactiveTabClass = 'flex-1 py-2 px-4 text-gray-500 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 font-semibold focus:outline-none'

const form = reactive({
  document: '',
  username: '',
  password: '',
  code: '',
  shift: ''
})

const errors = reactive({})

const guardSchema = yup.object({
  document: yup.string().required('Documento requerido'),
  password: yup.string().required('Clave requerida'),
  shift: yup.string().required('Seleccione una jornada')
})
const adminSchema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().required('Clave requerida')
})

const router = useRouter()

const authStore = useAuthStore()

async function onSubmit() {
  errorMsg.value = ''
  loading.value = true
  try {
    if (tab.value === 'guard') {
      await guardSchema.validate(form, { abortEarly: false })
      await authStore.login({
        userType: 'guard',
        username: form.document,
        password: form.password
      })
    } else {
      await adminSchema.validate(form, { abortEarly: false })
      await authStore.login({
        userType: 'admin',
        username: form.username,
        password: form.password
      })
    }
    loading.value = false
    Object.keys(errors).forEach(k => errors[k] = '')
    router.push('/formulario-guardia')
  } catch (err) {
    loading.value = false
    if (err.inner) {
      Object.keys(errors).forEach(k => errors[k] = '')
      err.inner.forEach(e => { errors[e.path] = e.message })
    } else {
      errorMsg.value = err.message
    }
  }
}
</script>

<style scoped>
.input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500;
}
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
  display: inline-block;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
