<template>
  <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
        <h2 class="text-6xl font-bold text-yellow-600 mb-4">404</h2>
        <h3 class="text-2xl font-medium text-gray-900 mb-4">Página no encontrada</h3>
        <p class="text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe.</p>
        <router-link 
          to="/dashboard" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Volver al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>
