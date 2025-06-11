<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-bold">Gestión de Administradores</h2>
      <button 
        @click="openModal('create')" 
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded flex items-center gap-2"
      >
        <PlusIcon class="w-5 h-5" />
        Registrar Administrador
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Admin List -->
    <div v-else class="bg-white rounded-lg shadow">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de creación</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Último acceso</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in admins" :key="admin._id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">{{ admin.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ admin.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(admin.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(admin.lastLogin) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="openModal('edit', admin)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button 
                  @click="confirmDelete(admin)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
            <tr v-if="admins.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                No hay administradores registrados
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Admin Modal (Create/Edit) -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">
          {{ isEditing ? 'Editar' : 'Registrar' }} Administrador
        </h3>
        
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Usuario</label>
            <input 
              v-model="form.username"
              type="text"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              :disabled="isEditing"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input 
              v-model="form.email"
              type="email"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div v-if="!isEditing">
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              v-model="form.password"
              type="password"
              :required="!isEditing"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div v-if="isEditing">
            <label class="block text-sm font-medium text-gray-700">Nueva contraseña (opcional)</label>
            <input 
              v-model="form.newPassword"
              type="password"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button 
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-md"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-md"
              :disabled="loading"
            >
              {{ isEditing ? 'Guardar cambios' : 'Registrar' }}
            </button>
          </div>
        </form>

        <div 
          v-if="error" 
          class="mt-4 p-3 rounded bg-red-50 text-red-600 text-sm"
        >
          {{ error }}
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold mb-4">Confirmar eliminación</h3>
        <p class="text-gray-600">
          ¿Está seguro que desea eliminar al administrador "{{ selectedAdmin?.username }}"? Esta acción no se puede deshacer.
        </p>
        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-md"
          >
            Cancelar
          </button>
          <button 
            @click="deleteAdmin"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
            :disabled="loading"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { PlusIcon } from 'lucide-vue-next';
import api from '../src/api';

const admins = ref([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const loading = ref(false);
const error = ref('');
const isEditing = ref(false);
const selectedAdmin = ref(null);

const form = ref({
  username: '',
  email: '',
  password: '',
  newPassword: ''
});

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const fetchAdmins = async () => {
  loading.value = true;
  try {
    const response = await api.get('/admins');
    admins.value = response.data;
  } catch (err) {
    error.value = 'Error al cargar los administradores';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.value = {
    username: '',
    email: '',
    password: '',
    newPassword: ''
  };
  error.value = '';
};

const openModal = (mode, admin = null) => {
  isEditing.value = mode === 'edit';
  if (isEditing.value && admin) {
    form.value = {
      ...admin,
      newPassword: ''
    };
    selectedAdmin.value = admin;
  } else {
    resetForm();
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  showDeleteModal.value = false;
  resetForm();
  selectedAdmin.value = null;
};

const handleSubmit = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (isEditing.value) {
      const data = {
        email: form.value.email
      };
      if (form.value.newPassword) {
        data.password = form.value.newPassword;
      }
      await api.put(`/admins/${selectedAdmin.value._id}`, data);
    } else {
      await api.post('/admins', {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password
      });
    }
    await fetchAdmins();
    closeModal();
  } catch (err) {
    error.value = err.response?.data?.message || 
      `Error al ${isEditing.value ? 'actualizar' : 'crear'} el administrador`;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (admin) => {
  selectedAdmin.value = admin;
  showDeleteModal.value = true;
};

const deleteAdmin = async () => {
  loading.value = true;
  try {
    await api.delete(`/admins/${selectedAdmin.value._id}`);
    await fetchAdmins();
    closeModal();
  } catch (err) {
    error.value = 'Error al eliminar el administrador';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchAdmins);
</script>
