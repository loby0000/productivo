<template>
  <div class="w-full max-w-xs bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
    <button class="self-end mb-2 bg-red-500 text-white px-3 py-1 rounded" @click="$emit('salir')">Salir</button>
    <div class="w-full flex-1 overflow-y-auto mb-4">
      <div v-for="equipo in equiposOrdenados" :key="equipo._id" class="mb-2 p-2 border rounded bg-gray-50">
        <div class="font-semibold">{{ equipo.deviceBrand }}</div>
        <div class="text-xs text-gray-600">Serial: {{ equipo.deviceSerial }}</div>
      </div>
    </div>
    <button class="bg-blue-600 text-white px-4 py-2 rounded mb-2" @click="mostrarForm = !mostrarForm">
      Registrar Nuevo equipo
    </button>
    <form v-if="mostrarForm" @submit.prevent="registrarEquipo" class="w-full flex flex-col gap-2 mt-2">
      <select v-model="nuevoEquipo.deviceBrand" required class="border rounded p-1">
        <option value="">Marca Del Equipo</option>
        <option value="Lenovo">Lenovo</option>
        <option value="HP">HP</option>
        <option value="Dell">Dell</option>
        <option value="Asus">Asus</option>
        <option value="Acer">Acer</option>
        <option value="Apple">Apple</option>
        <option value="Samsung">Samsung</option>
        <option value="MSI">MSI</option>
        <option value="Huawei">Huawei</option>
        <option value="Otro">Otro</option>
      </select>
      <input v-model="nuevoEquipo.deviceSerial" type="text" required placeholder="Serial Del Equipo" class="border rounded p-1" />
      <textarea v-model="nuevoEquipo.deviceFeatures" required placeholder="Características" class="border rounded p-1"></textarea>
      <div class="flex gap-4">
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="nuevoEquipo.hasMouse" /> Mouse
        </label>
        <label class="flex items-center gap-1">
          <input type="checkbox" v-model="nuevoEquipo.hasCharger" /> Cargador
        </label>
      </div>
      <button type="submit" class="bg-green-600 text-white px-3 py-1 rounded">Registrar Equipo Nuevo</button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  equipos: {
    type: Array,
    default: () => []
  }
})
const emit = defineEmits(['registrar', 'salir'])

const mostrarForm = ref(false)
const nuevoEquipo = ref({
  deviceBrand: '',
  deviceSerial: '',
  deviceFeatures: '',
  hasMouse: false,
  hasCharger: false
})

const equiposOrdenados = computed(() => {
  return [...props.equipos].sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
})

function registrarEquipo() {
  emit('registrar', { ...nuevoEquipo.value })
  mostrarForm.value = false
  nuevoEquipo.value = {
    deviceBrand: '',
    deviceSerial: '',
    deviceFeatures: '',
    hasMouse: false,
    hasCharger: false
  }
}
</script>

<style scoped>
/* ...estilos opcionales... */
</style>
