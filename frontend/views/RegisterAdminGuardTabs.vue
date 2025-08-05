<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white rounded-lg shadow-md w-full max-w-md p-8">
      <div class="flex mb-8 border-b">
        <button :class="tab === 'guard' ? activeTabClass : inactiveTabClass" @click="tab = 'guard'">Registrar Guardia</button>
        <button :class="tab === 'admin' ? activeTabClass : inactiveTabClass" @click="tab = 'admin'">Registrar Administrador</button>
      </div>
      <form v-if="tab === 'guard'" @submit.prevent="registerGuard" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Documento</label>
          <input v-model="guardForm.document" class="input" />
          <span class="text-red-500 text-xs">{{ errors.document }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="guardForm.name" class="input" />
          <span class="text-red-500 text-xs">{{ errors.name }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Jornada</label>
          <select v-model="guardForm.shift" class="input">
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
          </select>
          <span class="text-red-500 text-xs">{{ errors.shift }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <select v-model="guardForm.status" class="input">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <span class="text-red-500 text-xs">{{ errors.status }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" v-model="guardForm.password" class="input" />
          <span class="text-red-500 text-xs">{{ errors.password }}</span>
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold" :disabled="loading">
          <span v-if="loading" class="loader mr-2"></span>
          Registrar Guardia
        </button>
        <div v-if="successMsg" class="text-green-600 text-sm text-center mt-2">{{ successMsg }}</div>
        <div v-if="errorMsg" class="text-red-600 text-sm text-center mt-2">{{ errorMsg }}</div>
      </form>
      <form v-else @submit.prevent="registerAdmin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Usuario Admin</label>
          <input v-model="adminForm.username" class="input" />
          <span class="text-red-500 text-xs">{{ errors.username }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Clave Admin</label>
          <input type="password" v-model="adminForm.password" class="input" />
          <span class="text-red-500 text-xs">{{ errors.password }}</span>
        </div>
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md font-semibold" :disabled="loading">
          <span v-if="loading" class="loader mr-2"></span>
          Registrar Administrador
        </button>
        <div v-if="successMsg" class="text-green-600 text-sm text-center mt-2">{{ successMsg }}</div>
        <div v-if="errorMsg" class="text-red-600 text-sm text-center mt-2">{{ errorMsg }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import * as yup from 'yup'
import api from '../src/api'

const tab = ref('guard')
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const errors = reactive({})

const guardForm = reactive({
  document: '',
  name: '',
  shift: 'mañana',
  status: 'activo',
  password: ''
})
const adminForm = reactive({
  username: '',
  password: ''
})

const guardSchema = yup.object({
  document: yup.string().required('Documento requerido'),
  name: yup.string().required('Nombre requerido'),
  shift: yup.string().oneOf(['mañana','tarde','noche']).required('Jornada requerida'),
  status: yup.string().oneOf(['activo','inactivo']).required('Estado requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida')
})
const adminSchema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida')
})

async function registerGuard() {
  successMsg.value = ''
  errorMsg.value = ''
  loading.value = true
  try {
    await guardSchema.validate(guardForm, { abortEarly: false })
    await api.post('/guards/register', guardForm)
    successMsg.value = 'Guardia registrado exitosamente'
    Object.keys(errors).forEach(k => errors[k] = '')
    Object.keys(guardForm).forEach(k => guardForm[k] = k === 'shift' ? 'mañana' : k === 'status' ? 'activo' : '')
  } catch (err) {
    if (err.inner) {
      Object.keys(errors).forEach(k => errors[k] = '')
      err.inner.forEach(e => { errors[e.path] = e.message })
    } else {
      errorMsg.value = err.response?.data?.message || err.message
    }
  }
  loading.value = false
}

async function registerAdmin() {
  successMsg.value = ''
  errorMsg.value = ''
  loading.value = true
  try {
    await adminSchema.validate(adminForm, { abortEarly: false })
    await api.post('/admins/register', adminForm)
    successMsg.value = 'Administrador registrado exitosamente'
    Object.keys(errors).forEach(k => errors[k] = '')
    Object.keys(adminForm).forEach(k => adminForm[k] = '')
  } catch (err) {
    if (err.inner) {
      Object.keys(errors).forEach(k => errors[k] = '')
      err.inner.forEach(e => { errors[e.path] = e.message })
    } else {
      errorMsg.value = err.response?.data?.message || err.message
    }
  }
  loading.value = false
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