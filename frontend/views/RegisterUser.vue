<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Registro de Usuario con Equipo</h2>
      <form @submit.prevent="submitForm" class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">¿Usuario registrado?</label>
          <select v-model="form.isRegistered" @change="handleIsRegisteredChange" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="">Seleccione una opción</option>
            <option value="registrado">Registrado</option>
            <option value="no-registrado">No registrado</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
          <select v-model="form.userType" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="empleado">Empleado</option>
            <option value="visitante">Visitante</option>
            <option value="aprendiz">Aprendiz</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Nombre</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
          <select v-model="form.documentType" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="Cédula">Cédula</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
            <option value="Extranjero">Extranjero</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Número de Documento</label>
          <input v-model="form.documentNumber" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="form.email" type="email" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Equipo:</label>
          <select v-model="form.deviceBrand" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
            <option value="">Seleccione la marca</option>
            <option value="Lenovo">Lenovo</option>
            <option value="HP">HP</option>
            <option value="Dell">Dell</option>
            <option value="Asus">Asus</option>
            <option value="Acer">Acer</option>
            <option value="Apple">Apple</option>
            <option value="Samsung">Samsung</option>
            <option value="MSI">MSI</option>
            <option value="Huawei">Huawei</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Serial del Equipo</label>
          <input v-model="form.deviceSerial" type="text" required class="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div class="flex flex-col gap-2">
          <label class="block text-sm font-medium text-gray-700">Características</label>
          <textarea v-model="form.deviceFeatures" required class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
        </div>
        <div class="flex gap-6 mt-2">
          <div class="flex items-center gap-2">
            <input id="mouse" v-model="form.hasMouse" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label for="mouse" class="block text-sm text-gray-700">Mouse</label>
          </div>
          <div class="flex items-center gap-2">
            <input id="charger" v-model="form.hasCharger" type="checkbox" class="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label for="charger" class="block text-sm text-gray-700">Cargador</label>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">Registrar Usuario</button>
        </div>
        <div v-if="success" class="mt-4 text-green-600 text-center font-semibold">¡Usuario registrado exitosamente!</div>
        <div v-if="error" class="mt-4 text-red-600 text-center font-semibold">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../src/api'
import EquiposUsuario from '../src/components/EquiposUsuario.vue'

const router = useRouter()
const form = ref({
  isRegistered: '',
  userType: '',
  name: '',
  documentType: '',
  documentNumber: '',
  email: '',
  deviceBrand: '',
  deviceSerial: '',
  deviceFeatures: '',
  hasMouse: false,
  hasCharger: false
})
const success = ref(false)
const error = ref('')
const users = ref([])
const search = ref('')
const userFilter = ref('')

// Panel lateral de equipos
const mostrarPanelEquipos = ref(false)
const equiposUsuario = ref([])

const agregarEquipo = (nuevoEquipo) => {
  equiposUsuario.value.unshift({
    ...nuevoEquipo,
    _id: Date.now().toString(),
    createdAt: new Date().toISOString()
  })
}

const submitForm = async () => {
  if (form.value.isRegistered === 'registrado') return
  try {
    success.value = false
    error.value = ''
    await api.post('/users/register', form.value)
    success.value = true
    form.value = {
      isRegistered: '',
      userType: '',
      name: '',
      documentType: '',
      documentNumber: '',
      email: '',
      deviceBrand: '',
      deviceSerial: '',
      deviceFeatures: '',
      hasMouse: false,
      hasCharger: false
    }
    equiposUsuario.value = []
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al registrar usuario'
  }
}

const fetchUsers = async () => {
  const res = await api.get('/users')
  users.value = res.data
}

const filteredUsers = computed(() => {
  let base = users.value
  if (userFilter.value) {
    base = base.filter(u => u.userType === userFilter.value)
  }
  if (search.value) {
    base = base.filter(u => (u.documentNumber || '').includes(search.value))
  }
  return base
})

const handleIsRegisteredChange = () => {
  if (form.value.isRegistered === 'registrado') {
    router.push('/consulta-usuarios')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* ...estilos opcionales... */
</style>
