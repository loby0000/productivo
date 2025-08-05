<template>
  <div class="p-8">
    <h2 class="text-xl font-bold mb-4">Historial de Entradas y Salidas</h2>
    
    <!-- Filters -->
    <div class="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Tipo Usuario</label>
        <select v-model="filters.userType" class="w-full border rounded px-2 py-1">
          <option value="">Todos</option>
          <option value="student">Estudiante</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Fecha Desde</label>
        <input type="date" v-model="filters.startDate" class="w-full border rounded px-2 py-1">
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Fecha Hasta</label>
<template>
  <div>
    <h1>Historial</h1>
    <!-- Aquí irá la funcionalidad de historial -->
  </div>
</template>
<script setup>
// ... lógica de historial ...
</script>
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Documento</label>
        <input type="text" v-model="filters.documentNumber" placeholder="Buscar por documento" class="w-full border rounded px-2 py-1">
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Table -->
    <div v-else>
      <div class="overflow-x-auto">
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
            <tr v-for="item in paginatedHistory" :key="item._id" class="hover:bg-gray-50">
              <td class="border px-2 py-1">{{ item.userType }}</td>
              <td class="border px-2 py-1">{{ item.documentNumber }}</td>
              <td class="border px-2 py-1">{{ formatDate(item.entryTime) }}</td>
              <td class="border px-2 py-1">{{ formatDate(item.exitTime) }}</td>
              <td class="border px-2 py-1">{{ item.equipmentSerial }}</td>
              <td class="border px-2 py-1">{{ item.guardId?.name || '-' }}</td>
              <td class="border px-2 py-1">{{ item.recordType }}</td>
            </tr>
            <tr v-if="filteredHistory.length === 0">
              <td colspan="7" class="text-center py-4">No se encontraron registros</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-600">
          Mostrando {{ startIndex + 1 }} a {{ Math.min(endIndex, filteredHistory.length) }} de {{ filteredHistory.length }} registros
        </div>
        <div class="flex space-x-2">
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button 
            @click="currentPage++" 
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import api from '../src/api';

const history = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const filters = ref({
  userType: '',
  startDate: '',
  endDate: '',
  documentNumber: ''
});

const fetchHistory = async () => {
  loading.value = true;
  try {
    const res = await api.get('/history');
    history.value = res.data || [];
  } catch (error) {
    console.error('Error fetching history:', error);
  } finally {
    loading.value = false;
  }
};

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

const filteredHistory = computed(() => {
  let filtered = history.value;

  if (filters.value.userType) {
    filtered = filtered.filter(item => item.userType === filters.value.userType);
  }

  if (filters.value.documentNumber) {
    filtered = filtered.filter(item => 
      item.documentNumber.toLowerCase().includes(filters.value.documentNumber.toLowerCase())
    );
  }

  if (filters.value.startDate) {
    const start = new Date(filters.value.startDate);
    filtered = filtered.filter(item => new Date(item.entryTime) >= start);
  }

  if (filters.value.endDate) {
    const end = new Date(filters.value.endDate + 'T23:59:59');
    filtered = filtered.filter(item => new Date(item.entryTime) <= end);
  }

  return filtered;
});

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => startIndex.value + itemsPerPage);
const totalPages = computed(() => Math.ceil(filteredHistory.value.length / itemsPerPage));

const paginatedHistory = computed(() => {
  return filteredHistory.value.slice(startIndex.value, endIndex.value);
});

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1;
}, { deep: true });

onMounted(fetchHistory);
</script>
