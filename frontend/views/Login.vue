<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-50">
    <div class="bg-white shadow-lg rounded-lg w-full max-w-md p-8">
      <div class="flex mb-6 border-b">
        <button :class="tab==='guard' ? activeTabClass : inactiveTabClass" @click="tab='guard'">Guardia</button>
        <button :class="tab==='admin' ? activeTabClass : inactiveTabClass" @click="tab='admin'">Administrador</button>
      </div>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <div v-if="tab==='guard'">
          <label class="block text-sm font-medium text-gray-700">Documento</label>
          <input v-model="form.document" class="input" autocomplete="username" />
          <span class="text-red-500 text-xs">{{ errors.document }}</span>
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
        <div v-if="tab==='admin' && show2FA">
          <label class="block text-sm font-medium text-gray-700">Código de verificación</label>
          <input v-model="form.code" class="input" />
          <span class="text-red-500 text-xs">{{ errors.code }}</span>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold flex items-center justify-center" :disabled="loading">
          <span v-if="loading" class="loader mr-2"></span>
          Iniciar Sesión
        </button>
        <div v-if="errorMsg" class="text-red-600 text-sm text-center mt-2">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const tab = ref('guard')
const show2FA = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const activeTabClass = 'flex-1 py-2 px-4 text-blue-600 border-b-2 border-blue-600 font-semibold focus:outline-none'
const inactiveTabClass = 'flex-1 py-2 px-4 text-gray-500 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-300 font-semibold focus:outline-none'

const form = reactive({
  document: '',
  username: '',
  password: '',
  code: ''
})

const errors = reactive({})

const guardSchema = yup.object({
  document: yup.string().required('Documento requerido'),
  password: yup.string().required('Clave requerida')
})
const adminSchema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().required('Clave requerida'),
  code: yup.string().when('$show2FA', {
    is: true,
    then: yup.string().required('Código requerido')
  })
})

async function onSubmit() {
  errorMsg.value = ''
  loading.value = true
  try {
    if (tab.value === 'guard') {
      await guardSchema.validate(form, { abortEarly: false })
      // Aquí iría la llamada al backend para login de guardia
      // Simulación de éxito:
      loading.value = false
      // Redirigir o mostrar dashboard
    } else {
      await adminSchema.validate(form, { abortEarly: false, context: { show2FA: show2FA.value } })
      // Aquí iría la llamada al backend para login de admin
      // Si requiere 2FA, set show2FA.value = true
      // Simulación:
      if (!show2FA.value) {
        show2FA.value = true
        loading.value = false
        return
      }
      loading.value = false
      // Redirigir o mostrar dashboard
    }
    Object.keys(errors).forEach(k => errors[k] = '')
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
