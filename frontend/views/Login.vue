<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo or header image could go here -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Control de Acceso SENA</h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLoading ? 'Verificando credenciales...' : 'Ingrese sus credenciales para continuar' }}
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow">
        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <XCircle class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
            </div>
          </div>
        </div>

        <div class="rounded-md shadow-sm -space-y-px">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ userType === 'admin' ? 'Usuario' : 'Documento' }}
            </label>
            <input 
              v-model="form.username" 
              :type="userType === 'admin' ? 'text' : 'number'"
              required
              :placeholder="userType === 'admin' ? 'Nombre de usuario' : 'Número de documento'"
              class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
              :class="{ 'border-red-300': error }"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div class="relative">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="Contraseña"
                class="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm pr-10"
                :class="{ 'border-red-300': error }"
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Eye v-if="!showPassword" class="h-5 w-5 text-gray-400" />
                <EyeOff v-else class="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de usuario</label>
            <select 
              v-model="form.userType"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm rounded-md"
            >
              <option value="admin">Administrador</option>
              <option value="guard">Guardia</option>
            </select>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Lock class="h-5 w-5 text-yellow-500 group-hover:text-yellow-400" />
            </span>
            {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Lock, Eye, EyeOff, XCircle } from 'lucide-vue-next';
import { useAuthStore } from '../store/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: '',
  password: '',
  userType: 'guard' // valor por defecto
});

const userType = computed(() => form.userType);
const isLoading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    await authStore.login({
      username: form.username,
      password: form.password,
      userType: form.userType
    });
    
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 
      'Error al iniciar sesión. Por favor, verifique sus credenciales.';
  } finally {
    isLoading.value = false;
  }
};
</script>
