<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-100 py-10">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-5xl">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700">Consulta de Usuarios Registrados</h2>
      <div class="flex items-center mb-4 gap-2">
        <select v-model="tipoConsulta" @change="handleTipoConsulta" class="border rounded-md px-3 py-1">
          <option value="registrados">Registrado</option>
          <option value="no-registrado">No registrado</option>
        </select>
      </div>
      <table class="min-w-full border border-gray-300">
        <!-- Encabezado de la tabla -->
        <thead class="bg-gray-100">
          <tr>
            <th class="px-2 py-1 border">Tipo De Usuario</th>
            <th class="px-2 py-1 border">Tipo De Documento</th>
            <th class="px-2 py-1 border">Documento</th>
            <th class="px-2 py-1 border">Nombre</th>
            <th class="px-2 py-1 border">Equipo</th>
            <th class="px-2 py-1 border">Serial</th>
            <th class="px-2 py-1 border">Características</th>
            <th class="px-2 py-1 border">Acción</th>
          </tr>
        </thead>
        <!-- Cuerpo de la tabla -->
        <tbody>
          <tr v-for="user in filteredUsers" :key="user._id">
            <td class="px-2 py-1 border">{{ user.userType }}</td>
            <td class="px-2 py-1 border">{{ user.documentType }}</td>
            <td class="px-2 py-1 border">{{ user.documentNumber }}</td>
            <td class="px-2 py-1 border">{{ user.name }}</td>
            <td class="px-2 py-1 border">
              <span v-if="user.deviceBrand">{{ user.deviceBrand }}</span>
              <span v-if="user.deviceBrand" class="cursor-pointer text-blue-600 hover:underline ml-1" @click="abrirPanelEquipos(user)">:</span>
            </td>
            <td class="px-2 py-1 border">{{ user.deviceSerial }}</td>
            <td class="px-2 py-1 border">{{ getFeaturesText(user) }}</td>
            <td class="px-2 py-1 border">
              <button @click="registrarAcceso(user)" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" :disabled="user.registrando">
                {{ user.registrando ? 'Registrando...' : 'Registrar' }}
              </button>
            </td>
          </tr>

        </tbody>
      </table>
      <EquiposUsuario
        v-if="mostrarPanelEquipos"
        :equipos="equiposUsuario"
        @salir="mostrarPanelEquipos = false"
        class="fixed top-0 right-0 z-50 h-full shadow-2xl"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../src/api'
import EquiposUsuario from '../src/components/EquiposUsuario.vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const users = ref([])
const search = ref('')
const userFilter = ref('')

const tipoConsulta = ref('registrados')
const router = useRouter()

function handleTipoConsulta() {
  if (tipoConsulta.value === 'no-registrado') {
    router.push('/registrar-usuario')
  }
}

// Panel lateral de equipos
const mostrarPanelEquipos = ref(false)
const equiposUsuario = ref([])

function abrirPanelEquipos(user) {
  // Si tienes varios equipos por usuario, aquí deberías asignar el array correspondiente
  equiposUsuario.value = [
    {
      deviceBrand: user.deviceBrand,
      deviceSerial: user.deviceSerial,
      deviceFeatures: user.deviceFeatures,
      hasMouse: user.hasMouse,
      hasCharger: user.hasCharger,
      _id: user._id,
      createdAt: user.createdAt
    }
  ]
  mostrarPanelEquipos.value = true
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

function getFeaturesText(user) {
  let text = user.deviceFeatures || ''
  const extras = []
  if (user.hasMouse) extras.push('mouse')
  if (user.hasCharger) extras.push('cargador')
  if (extras.length) {
    text += (text ? ' y ' : '') + 'lleva ' + extras.join(' y ')
  }
  return text
}

onMounted(() => {
  fetchUsers()
})

// Registrar entrada/salida
async function registrarAcceso(user) {
  user.registrando = true
  try {
    await api.post('/history/auto', {
      userId: user._id,
      documentNumber: user.documentNumber
    })
  } catch (e) {}
  setTimeout(() => {
    user.registrando = false
  }, 1500)
}
</script>

<style scoped>
/* ...estilos opcionales... */
</style>
