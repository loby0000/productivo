<template>
  <form class="space-y-4" @submit.prevent="onSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700">Nombre</label>
      <input v-model="values.name" class="input" />
      <span class="text-red-500 text-xs">{{ errors.name }}</span>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Documento</label>
      <input v-model="values.document" class="input" />
      <span class="text-red-500 text-xs">{{ errors.document }}</span>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Jornada</label>
      <select v-model="values.shift" class="input">
        <option value="mañana">Mañana</option>
        <option value="tarde">Tarde</option>
        <option value="noche">Noche</option>
      </select>
      <span class="text-red-500 text-xs">{{ errors.shift }}</span>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Estado</label>
      <select v-model="values.status" class="input">
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>
      <span class="text-red-500 text-xs">{{ errors.status }}</span>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Contraseña</label>
      <input type="password" v-model="values.password" class="input" />
      <span class="text-red-500 text-xs">{{ errors.password }}</span>
    </div>
    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-md font-semibold" :disabled="isSubmitting">
      {{ isSubmitting ? 'Registrando...' : 'Registrar' }}
    </button>
  </form>
</template>
<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
const emit = defineEmits(['request-admin-auth'])
const schema = yup.object({
  name: yup.string().required('Nombre requerido'),
  document: yup.string().required('Documento requerido'),
  shift: yup.string().oneOf(['mañana','tarde','noche']).required(),
  status: yup.string().oneOf(['activo','inactivo']).required(),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required()
})
const { handleSubmit, errors, values, isSubmitting } = useForm({ validationSchema: schema })
const onSubmit = handleSubmit((data) => {
  emit('request-admin-auth', data)
})
</script>
<style scoped>
.input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500;
}
</style> 