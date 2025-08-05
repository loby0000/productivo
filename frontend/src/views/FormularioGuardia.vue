<template>
  <div class="p-8 text-center">
    <h1 v-if="isSoloGuardia" class="text-3xl font-bold text-blue-700 mb-4">Registro de Usuario Con Equipos</h1>
    <h1 v-else-if="isAdmin" class="text-3xl font-bold text-green-700 mb-4">Registro de Usuario Con Equipos (Admin)</h1>
    <h1 v-else class="text-3xl font-bold text-blue-700 mb-4">Registro de Guardia</h1>
    <div v-if="isSoloGuardia">
      <!-- Formulario SOLO para guardia, según imagen -->
      <form class="max-w-md mx-auto text-left">
        <div class="mb-6">
          <select class="border rounded px-4 py-2">
            <option>Usuarios Por Registrar</option>
          </select>
        </div>
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Tipo De Usuario" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Tipo De Documento" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Nombre" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Documento" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Telefono" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Serial Del Equipo" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Marca Del Equipo" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Características" />
        <div class="mb-2">
          <label><input type="checkbox" /> Mouse</label>
          <label class="ml-4"><input type="checkbox" /> Cargador</label>
        </div>
        <div class="mb-2 text-green-600 font-semibold">El Registro A Sido Exitoso</div>
        <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded">Registrar</button>
      </form>
    </div>
    <div v-else-if="isAdmin">
      <div class="mb-6">
        <select v-model="vista" class="border rounded px-4 py-2">
          <option value="formulario">Usuarios Por Registrar</option>
          <option value="tabla">Usuarios Registrados</option>
        </select>
      </div>
      <div v-if="vista === 'formulario'">
        <!-- Formulario de registro completo para admin -->
        <form class="max-w-md mx-auto text-left">
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Tipo De Usuario" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Tipo De Documento" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Nombre" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Documento" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Telefono" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Serial Del Equipo" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Marca Del Equipo" />
          <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Características" />
          <div class="mb-2">
            <label><input type="checkbox" /> Mouse</label>
            <label class="ml-4"><input type="checkbox" /> Cargador</label>
          </div>
          <div class="mb-2 text-green-600 font-semibold">El Registro A Sido Exitoso</div>
          <button type="submit" class="bg-green-600 text-white px-6 py-2 rounded">Registrar</button>
        </form>
      </div>
      <div v-else>
        <!-- Tabla de usuarios registrados -->
        <div class="mb-4 flex items-center justify-between">
          <div>
            <input class="border rounded px-2 py-1" placeholder="Buscar Por Documento" />
            <button class="ml-2 bg-blue-600 text-white px-4 py-1 rounded">Buscar</button>
          </div>
          <select class="border rounded px-2 py-1">
            <option>Usuarios Registrados</option>
          </select>
        </div>
        <table class="w-full border mb-4">
          <thead>
            <tr>
              <th>Tipo De Usuario</th>
              <th>Tipo De Documento</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Equipo</th>
              <th>Serial</th>
              <th>Características</th>
            </tr>
          </thead>
          <tbody>
            <!-- Aquí irían los datos de usuarios registrados -->
            <tr>
              <td>Guardia</td>
              <td>CC</td>
              <td>123456</td>
              <td>Juan Pérez</td>
              <td>Laptop</td>
              <td>ABC123</td>
              <td>Mouse, Cargador</td>
            </tr>
          </tbody>
        </table>
        <button class="bg-green-600 text-white px-6 py-2 rounded">Registrar</button>
      </div>
    </div>
    <div v-else>
      <!-- Formulario simplificado para guardia -->
      <form class="max-w-md mx-auto text-left">
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Nombre" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Documento" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Telefono" />
        <input class="w-full mb-2 border rounded px-2 py-1" placeholder="Turno" />
        <div class="mb-2 text-blue-600 font-semibold">Registro de guardia exitoso</div>
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">Registrar Guardia</button>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FormularioGuardia',
  data() {
    return {
      vista: 'formulario'
    }
  },
  computed: {
    isAdmin() {
      return this.$route.path === '/admin-formulario';
    },
    isSoloGuardia() {
      return this.$route.path === '/formulario-guardia';
    }
  }
}
</script>
<style scoped>
</style>
