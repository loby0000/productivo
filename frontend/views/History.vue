<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Historial de Entradas y Salidas</h2>
    <table class="min-w-full bg-white border">
      <thead>
        <tr>
          <th class="border px-2 py-1">Tipo Usuario</th>
          <th class="border px-2 py-1">Documento</th>
          <th class="border px-2 py-1">Entrada</th>
          <th class="border px-2 py-1">Salida</th>
          <th class="border px-2 py-1">Serial Equipo</th>
          <th class="border px-2 py-1">Guardia</th>
          <th class="border px-2 py-1">Tipo Registro</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in history" :key="item._id">
          <td class="border px-2 py-1">{{ item.userType }}</td>
          <td class="border px-2 py-1">{{ item.documentNumber }}</td>
          <td class="border px-2 py-1">{{ formatDate(item.entryTime) }}</td>
          <td class="border px-2 py-1">{{ formatDate(item.exitTime) }}</td>
          <td class="border px-2 py-1">{{ item.equipmentSerial }}</td>
          <td class="border px-2 py-1">{{ item.guardId?.name || '-' }}</td>
          <td class="border px-2 py-1">{{ item.recordType }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const history = ref([]);

const fetchHistory = async () => {
  const res = await api.get('/history');
  history.value = res.data || [];
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString();
};

onMounted(fetchHistory);
</script>
