<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Gestión de Usuarios</h2>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
        <Plus class="h-5 w-5 mr-2" />
        Nuevo Usuario
      </button>
    </div>
    <p class="mt-2 text-center text-sm text-gray-600">
      ¿Ya tienes cuenta? <button @click="goToLogin" class="text-blue-600 hover:underline">Inicia sesión aquí</button>
    </p>

    <!-- Tabla de usuarios -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden border-b border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in users" :key="user._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ user.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ user.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="editUser(user)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit class="h-5 w-5" />
                    </button>
                    <button @click="deleteUser(user._id)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">{{ isEditing ? 'Editar' : 'Nuevo' }} Usuario</h3>
        <form @submit.prevent="saveUser">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
              <input type="text" v-model="userForm.username" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" v-model="userForm.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Documento</label>
              <input type="text" v-model="userForm.documentNumber" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Documento</label>
              <input type="text" v-model="userForm.documentType" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tipo de Usuario</label>
              <select v-model="userForm.userType" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="user">Usuario</option>
                <option value="guard">Guardia</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Contraseña</label>
              <input type="password" v-model="userForm.password" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="showAddModal = false" class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md">
              Cancelar
            </button>
            <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-md">
              {{ isEditing ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="showSuccess" class="rounded-md bg-green-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-green-800">Usuario registrado exitosamente</h3>
        </div>
      </div>
      <div class="mt-2 text-green-700 text-sm">
        Ahora puedes iniciar sesión usando tus credenciales.
      </div>
      <div class="mt-2 text-green-700 text-sm">
        <button @click="goToLogin" class="text-blue-600 hover:underline">Iniciar sesión ahora</button>
        <p class="mt-1">Recuerda usar el usuario y contraseña que acabas de registrar.</p>
      </div>
    </div>
    <div v-if="errorMessage" class="rounded-md bg-red-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default {
  components: {
    Plus,
    Edit,
    Trash2
  },
  setup() {
    const users = ref([])
    const showAddModal = ref(false)
    const isEditing = ref(false)
    const userForm = ref({
      username: '',
      email: '',
      documentNumber: '',
      documentType: '',
      userType: 'user',
      password: ''
    })
    const showSuccess = ref(false)
    const errorMessage = ref("")
    const router = useRouter()

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`)
        users.value = response.data
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    const saveUser = async () => {
      try {
        const payload = {
          username: userForm.value.username,
          email: userForm.value.email,
          documentNumber: userForm.value.documentNumber,
          documentType: userForm.value.documentType,
          userType: userForm.value.userType,
          password: userForm.value.password
        }
        if (isEditing.value) {
          await axios.put(`${import.meta.env.VITE_API_URL}/users/${userForm.value._id}`, payload)
        } else {
          await axios.post(`${import.meta.env.VITE_API_URL}/users`, payload)
          showSuccess.value = true
          errorMessage.value = ""
          setTimeout(() => { showSuccess.value = false }, 3000)
        }
        showAddModal.value = false
        await fetchUsers()
        resetForm()
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Error al registrar usuario'
        showSuccess.value = false
        console.error('Error saving user:', error)
      }
    }

    const editUser = (user) => {
      userForm.value = { ...user }
      isEditing.value = true
      showAddModal.value = true
    }

    const deleteUser = async (id) => {
      if (confirm('¿Estás seguro de eliminar este usuario?')) {
        try {
          await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`)
          await fetchUsers()
        } catch (error) {
          console.error('Error deleting user:', error)
        }
      }
    }

    const resetForm = () => {
      userForm.value = {
        username: '',
        email: '',
        documentNumber: '',
        documentType: '',
        userType: 'user',
        password: ''
      }
      isEditing.value = false
    }

    const goToLogin = () => {
      router.push('/login')
    }

    onMounted(fetchUsers)

    return {
      users,
      showAddModal,
      isEditing,
      userForm,
      saveUser,
      editUser,
      deleteUser,
      goToLogin,
      showSuccess,
      errorMessage
    }
  }
}
</script>
