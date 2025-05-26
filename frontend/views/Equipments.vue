<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Gestión de Equipos</h2>
    <button @click="showRegister = true" class="mb-4 bg-purple-600 text-white px-4 py-2 rounded">Registrar Equipo</button>
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="border px-2 py-1">Serial</th>
          <th class="border px-2 py-1">Marca</th>
          <th class="border px-2 py-1">Descripción</th>
          <th class="border px-2 py-1">Mouse</th>
          <th class="border px-2 py-1">Cargador</th>
          <th class="border px-2 py-1">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="equipment in equipments" :key="equipment._id">
          <td class="border px-2 py-1">{{ equipment.serialNumber }}</td>
          <td class="border px-2 py-1">{{ equipment.brand }}</td>
          <td class="border px-2 py-1">{{ equipment.description }}</td>
          <td class="border px-2 py-1">{{ equipment.accessories?.mouse ? 'Sí' : 'No' }}</td>
          <td class="border px-2 py-1">{{ equipment.accessories?.charger ? 'Sí' : 'No' }}</td>
          <td class="border px-2 py-1">
            <button class="text-blue-600 mr-2" @click="editEquipment(equipment)">Editar</button>
            <button class="text-red-600" @click="deleteEquipment(equipment._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de registro -->
    <div v-if="showRegister" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
      <form @submit.prevent="registerEquipment" class="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 class="text-lg font-bold mb-4">Registrar Equipo</h3>
        <input v-model="form.serialNumber" placeholder="Serial" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.brand" placeholder="Marca" class="w-full border mb-2 px-2 py-1" required />
        <input v-model="form.description" placeholder="Descripción" class="w-full border mb-2 px-2 py-1" required />
        <div class="flex gap-4 mb-2">
          <label><input type="checkbox" v-model="form.accessories.mouse" /> Mouse</label>
          <label><input type="checkbox" v-model="form.accessories.charger" /> Cargador</label>
        </div>
        <div class="flex justify-end mt-4">
          <button type="button" @click="showRegister = false" class="mr-2 px-4 py-2">Cancelar</button>
          <button type="submit" class="bg-purple-600 text-white px-4 py-2 rounded">Registrar</button>
        </div>
        <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const equipments = ref([]);
const showRegister = ref(false);
const error = ref('');
const form = ref({
  serialNumber: '',
  brand: '',
  description: '',
  accessories: { mouse: false, charger: false },
});

const fetchEquipments = async () => {
  const res = await api.get('/equipments/all');
  equipments.value = res.data || [];
};

const registerEquipment = async () => {
  error.value = '';
  try {
    await api.post('/equipments/register', form.value);
    showRegister.value = false;
    fetchEquipments();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar equipo';
  }
};

const editEquipment = (equipment) => {
  // Implementar edición
  alert('Función de edición no implementada');
};

const deleteEquipment = async (id) => {
  // Implementar eliminación
  alert('Función de eliminación no implementada');
};

onMounted(fetchEquipments);
</script>
