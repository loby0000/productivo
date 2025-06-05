<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Gestión de Guardias</h2>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
        <Plus class="h-5 w-5 mr-2" />
        Nuevo Guardia
      </button>
    </div>

    <!-- Tabla de guardias -->
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
                    Identificación
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turno
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
                <tr v-for="guard in guards" :key="guard._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ guard.name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ guard.identification }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ guard.shift }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="guard.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ guard.active ? 'Activo' : 'Inactivo' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="editGuard(guard)" class="text-indigo-600 hover:text-indigo-900 mr-4">
                      <Edit class="h-5 w-5" />
                    </button>
                    <button @click="deleteGuard(guard._id)" class="text-red-600 hover:text-red-900">
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

    <!-- Modal para agregar/editar guardia -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">{{ isEditing ? 'Editar' : 'Nuevo' }} Guardia</h3>
        <form @submit.prevent="saveGuard">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input type="text" v-model="guardForm.name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Identificación</label>
              <input type="text" v-model="guardForm.identification" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Turno</label>
              <select v-model="guardForm.shift" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>
            </div>
            <div class="flex items-center">
              <input type="checkbox" v-model="guardForm.active" class="h-4 w-4 text-blue-600">
              <label class="ml-2 block text-sm text-gray-900">Activo</label>
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
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import axios from 'axios'

export default {
  components: {
    Plus,
    Edit,
    Trash2
  },
  setup() {
    const guards = ref([])
    const showAddModal = ref(false)
    const isEditing = ref(false)
    const guardForm = ref({
      name: '',
      identification: '',
      shift: 'mañana',
      active: true
    })

    const fetchGuards = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/guards')
        guards.value = response.data
      } catch (error) {
        console.error('Error fetching guards:', error)
      }
    }

    const saveGuard = async () => {
      try {
        if (isEditing.value) {
          await axios.put(`http://localhost:3000/api/guards/${guardForm.value._id}`, guardForm.value)
        } else {
          await axios.post('http://localhost:3000/api/guards', guardForm.value)
        }
        showAddModal.value = false
        await fetchGuards()
        resetForm()
      } catch (error) {
        console.error('Error saving guard:', error)
      }
    }

    const editGuard = (guard) => {
      guardForm.value = { ...guard }
      isEditing.value = true
      showAddModal.value = true
    }

    const deleteGuard = async (id) => {
      if (confirm('¿Estás seguro de eliminar este guardia?')) {
        try {
          await axios.delete(`http://localhost:3000/api/guards/${id}`)
          await fetchGuards()
        } catch (error) {
          console.error('Error deleting guard:', error)
        }
      }
    }

    const resetForm = () => {
      guardForm.value = {
        name: '',
        identification: '',
        shift: 'mañana',
        active: true
      }
      isEditing.value = false
    }

    onMounted(fetchGuards)

    return {
      guards,
      showAddModal,
      isEditing,
      guardForm,
      saveGuard,
      editGuard,
      deleteGuard
    }
  }
}
</script>
