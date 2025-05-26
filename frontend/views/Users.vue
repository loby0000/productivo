<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Gestión de Usuarios</h2>
    <button @click="showRegister = true" class="mb-4 bg-blue-600 text-white px-4 py-2 rounded">Registrar Usuario</button>
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="border px-2 py-1">Usuario</th>
          <th class="border px-2 py-1">Documento</th>
          <th class="border px-2 py-1">Tipo</th>
          <th class="border px-2 py-1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td class="border px-2 py-1">{{ user.username }}</td>
          <td class="border px-2 py-1">{{ user.documentNumber }}</td>
          <td class="border px-2 py-1">{{ user.userType }}</td>
          <td class="border px-2 py-1">
            <button class="text-blue-600 mr-2" @click="editUser(user)">Editar</button>
            <button class="text-red-600" @click="deleteUser(user._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de registro -->
    <div v-if="showRegister" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form @submit.prevent="registerUser" class="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Registrar Usuario</h3>
        <input v-model="form.username" placeholder="Usuario" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.password" type="password" placeholder="Contraseña" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.email" placeholder="Email" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.documentNumber" placeholder="Número de Documento" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.documentType" placeholder="Tipo de Documento" class="w-full border mb-2 px-2 py-1" required />
        <select v-model="form.userType" class="w-full border mb-2 px-2 py-1">
          <option value="user">Usuario</option>
          <option value="guard">Guardia</option>
          <option value="admin">Administrador</option>
        </select>
        <div class="flex justify-end mt-4">
          <button type="button" @click="showRegister = false" class="mr-2 px-4 py-2">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>
        <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const users = ref([]);
const showRegister = ref(false);
const error = ref('');
const form = ref({
  username: '',
  password: '',
  email: '',
  documentNumber: '',
  documentType: '',
  userType: 'user',
});

const fetchUsers = async () => {
  const res = await api.get('/users/filter');
  users.value = res.data.users || [];
};

const registerUser = async () => {
  error.value = '';
  try {
    await api.post('/users/register', form.value);
    showRegister.value = false;
    fetchUsers();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar usuario';
  }
};

const editUser = (user) => {
  // Implementar edición
  alert('Función de edición no implementada');
};

const deleteUser = async (id) => {
  // Implementar eliminación
  alert('Función de eliminación no implementada');
};

onMounted(fetchUsers);
</script>
