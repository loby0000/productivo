<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Gestión de Usuarios</h2>
    </div>
    <div class="flex items-center px-4 py-2">
      <input v-model="search" type="text" placeholder="Buscar" class="border rounded-md px-3 py-1 w-1/3" />
      <select v-model="userFilter" class="ml-4 border rounded-md px-2 py-1">
        <option value="">Usuarios Registrados</option>
        <option value="empleado">Empleado</option>
        <option value="visitante">Visitante</option>
        <option value="aprendiz">Aprendiz</option>
        <option value="otro">Otro</option>
      </select>
    </div>
    <!-- Tabla de usuarios -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden border-b border-gray-200">
            <table class="min-w-full divide-y divide-gray-200 border border-gray-300">
              <thead class="bg-gray-100">
                <tr>
                  <th class="px-4 py-2 border border-gray-300 text-left">Tipo De Usuario</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Nombre</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Tipo De Documento</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Documento</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Email</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Marca Del Equipo</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Serial Del Equipo</th>
                  <th class="px-4 py-2 border border-gray-300 text-left">Características</th>
                  <th class="px-4 py-2 border border-gray-300 text-center">Mouse</th>
                  <th class="px-4 py-2 border border-gray-300 text-center">Cargador</th>
                  <th class="px-4 py-2 border border-gray-300 text-center">Editar</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user._id">
                  <td class="px-4 py-2 border border-gray-300">{{ user.userType }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.name }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.documentType }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.documentNumber }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.email }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.deviceBrand }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.deviceSerial }}</td>
                  <td class="px-4 py-2 border border-gray-300">{{ user.deviceFeatures }}</td>
                  <td class="px-4 py-2 border border-gray-300 text-center">
                    <span v-if="user.hasMouse">✔</span>
                    <span v-else>✖</span>
                  </td>
                  <td class="px-4 py-2 border border-gray-300 text-center">
                    <span v-if="user.hasCharger">✔</span>
                    <span v-else>✖</span>
                  </td>
                  <td class="px-4 py-2 border border-gray-300 text-center">
                    <button @click="editUser(user)" class="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Editar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para editar usuario -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-8 max-w-xs w-full border-2 border-black relative">
        <h3 class="text-2xl font-semibold mb-6 text-center">Editar Usuario</h3>
        <form @submit.prevent="saveUser">
          <div class="mb-4">
            <label class="block text-lg font-medium mb-1">Nombre</label>
            <input type="text" v-model="userForm.name" class="w-full border rounded px-2 py-1 text-lg" />
          </div>
          <div class="mb-4">
            <label class="block text-lg font-medium mb-1">Tipo De Documento</label>
            <select v-model="userForm.documentType" class="w-full border rounded px-2 py-1 text-lg">
              <option value="Cédula">Cédula</option>
              <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
              <option value="Extranjero">Extranjero</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="block text-lg font-medium mb-1">Documento</label>
            <input type="text" v-model="userForm.documentNumber" class="w-full border rounded px-2 py-1 text-lg" />
          </div>
          <div class="flex justify-between items-center">
            <button type="submit" class="bg-gray-200 border border-black px-4 py-2 rounded text-lg" :disabled="loading">Guardar</button>
            <button type="button" @click="showAddModal = false" class="bg-gray-200 border border-black px-4 py-2 rounded text-lg">Cerrar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccess" class="rounded-md bg-green-50 p-4 mb-4 mt-4 w-fit mx-auto">
      <span class="text-sm font-medium text-green-800">Operación exitosa</span>
    </div>
    <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4 mt-4 w-fit mx-auto">
      <span class="text-sm font-medium text-red-800">{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
// import { Plus } from 'lucide-vue-next'
import api from '../src/api'
import { useRouter, useRoute } from 'vue-router'

export default {
  // components: { Plus },
  setup() {
    const users = ref([])
    const showAddModal = ref(false)
    const isEditing = ref(false)
    const userForm = ref({})
    const showSuccess = ref(false)
    const errorMessage = ref("")
    const search = ref("")
    const loading = ref(false)
    const router = useRouter()
    const route = useRoute()

    // Nuevo: guardar los datos de query si existen
    const queryUser = ref(null)
    const userFilter = ref('')

    const fetchUsers = async () => {
      loading.value = true
      try {
        const response = await api.get('/users')
        users.value = response.data
      } catch (error) {
        errorMessage.value = 'Error al obtener usuarios'
      } finally {
        loading.value = false
      }
    }

    // Nuevo: filtrar por query si existe
    const filteredUsers = computed(() => {
      let base = users.value
      if (userFilter.value) {
        base = base.filter(u => u.userType === userFilter.value)
      }
      if (!search.value) return base
      return base.filter(u =>
        (u.name || '').toLowerCase().includes(search.value.toLowerCase()) ||
        (u.documentNumber || '').includes(search.value) ||
        (u.email || '').toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const saveUser = async () => {
      loading.value = true
      try {
        const payload = {
          name: userForm.value.name,
          documentType: userForm.value.documentType,
          documentNumber: userForm.value.documentNumber
        }
        if (isEditing.value) {
          await api.put(`/users/${userForm.value._id}`, payload)
        }
        showAddModal.value = false
        await fetchUsers()
        showSuccess.value = true
        setTimeout(() => showSuccess.value = false, 2000)
        resetForm()
      } catch (error) {
        errorMessage.value = error.response?.data?.error || error.response?.data?.message || 'Error al actualizar usuario'
        showSuccess.value = false
        setTimeout(() => errorMessage.value = '', 2500)
        console.error('Error saving user:', error)
      } finally {
        loading.value = false
      }
    }

    const editUser = (user) => {
      userForm.value = {
        _id: user._id,
        name: user.name || '',
        documentType: user.documentType || '',
        documentNumber: user.documentNumber || ''
      }
      isEditing.value = true
      showAddModal.value = true
    }

    const resetForm = () => {
      userForm.value = {
        _id: '',
        name: '',
        documentType: '',
        documentNumber: ''
      }
      isEditing.value = false
    }

    const goToLogin = () => {
      router.push('/login')
    }

    onMounted(() => {
      // Si hay query, guardar datos para filtrar
      if (Object.keys(route.query).length) {
        queryUser.value = {
          name: route.query.name || '',
          documentNumber: route.query.documentNumber || ''
        }
      }
      fetchUsers()
    });

    return {
      users,
      showAddModal,
      isEditing,
      userForm,
      showSuccess,
      errorMessage,
      search,
      userFilter,
      filteredUsers,
      saveUser,
      editUser,
      goToLogin,
      loading
    }
  }
}
</script>
