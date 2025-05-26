<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Gestión de Administradores</h2>
    <button @click="showRegister = true" class="mb-4 bg-yellow-600 text-white px-4 py-2 rounded">Registrar Administrador</button>
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="border px-2 py-1">Usuario</th>
          <th class="border px-2 py-1">Fecha de creación</th>
          <th class="border px-2 py-1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin._id">
          <td class="border px-2 py-1">{{ admin.username }}</td>
          <td class="border px-2 py-1">{{ new Date(admin.createdAt).toLocaleString() }}</td>
          <td class="border px-2 py-1">
            <button class="text-blue-600 mr-2" @click="editAdmin(admin)">Editar</button>
            <button class="text-red-600" @click="deleteAdmin(admin._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de registro -->
    <div v-if="showRegister" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form @submit.prevent="registerAdmin" class="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Registrar Administrador</h3>
        <input v-model="form.username" placeholder="Usuario" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full border mb-2 px-2 py-1" required />
        <div class="flex justify-end mt-4">
          <button type="button" @click="showRegister = false" class="mr-2 px-4 py-2">Cancelar</button>
          <button type="submit" class="bg-yellow-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>
        <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const admins = ref([]);
const showRegister = ref(false);
const error = ref('');
const form = ref({
  username: '',
  password: '',
});

const fetchAdmins = async () => {
  // No hay endpoint directo para listar admins, esto es un placeholder
  admins.value = [];
};

const registerAdmin = async () => {
  error.value = '';
  try {
    await api.post('/admins/register', form.value);
    showRegister.value = false;
    fetchAdmins();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar administrador';
  }
};

const editAdmin = (admin) => {
  // Implementar edición
  alert('Función de edición no implementada');
};

const deleteAdmin = async (id) => {
  // Implementar eliminación
  alert('Función de eliminación no implementada');
};

onMounted(fetchAdmins);
</script>
