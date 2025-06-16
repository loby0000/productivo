<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 shadow-lg w-full max-w-sm">
      <h2 class="text-lg font-bold mb-4">Autenticación de Administrador</h2>
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
        <div class="flex justify-end space-x-2">
          <button type="button" class="bg-gray-200 px-4 py-2 rounded" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded" :disabled="isSubmitting">
            {{ isSubmitting ? 'Verificando...' : 'Verificar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { useForm } from 'vee-validate'
import * as yup from 'yup'
const emit = defineEmits(['close', 'auth-success'])
const schema = yup.object({
  username: yup.string().required('Usuario requerido'),
  password: yup.string().required('Clave requerida')
})
const { handleSubmit, errors, values, isSubmitting } = useForm({ validationSchema: schema })
const onSubmit = handleSubmit((data) => {
  emit('auth-success', data)
})
</script>
<style scoped>
.input {
  @apply mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500;
}
</style> 