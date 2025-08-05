<template>
  <div>
    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium text-gray-700">Usuario Admin</label>
        <input v-model="values.username" class="input" />
        <span class="text-red-500 text-xs">{{ errors.username }}</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Clave Admin</label>
        <input type="password" v-model="values.password" class="input" />
        <span class="text-red-500 text-xs">{{ errors.password }}</span>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Fecha de Creación</label>
        <input :value="fechaCreacion" class="input" disabled />
      </div>
      <button type="submit" class="w-full bg-green-600 text-white py-2 rounded-md font-semibold" :disabled="isSubmitting">
        {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
      </button>
    </form>
    <div class="mt-8">
      <h3 class="font-semibold mb-2">Log de cambios</h3>
      <ul class="text-xs text-gray-700 space-y-1">
        <li v-for="log in logs" :key="log.fecha">Admin: {{ log.usuario }} - {{ log.fecha }}</li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import { ref, computed } from 'vue'
import api from '../src/api'
const props = defineProps({ logs: { type: Array, default: () => [] } })
const emit = defineEmits(['new-admin'])
const schema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required()
})
const { handleSubmit, errors, values, resetForm, isSubmitting } = useForm({ validationSchema: schema })
const fechaCreacion = computed(() => new Date().toLocaleString())
const onSubmit = handleSubmit(async (data) => {
  try {
    await api.post('/admins/register', data)
    emit('new-admin', { usuario: data.username, fecha: new Date().toLocaleString() })
    alert('Administrador registrado exitosamente')
    resetForm()
  } catch (e) {
    alert(e.response?.data?.message || 'Error al registrar administrador')
  }
})
</script>
<style scoped>
.input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500;
}
</style> 