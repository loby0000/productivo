<template>
  <div class="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
    <div class="mb-6 text-center">
      <img src="/logo.png" alt="LOGO" class="mx-auto mb-2" style="max-width:180px;max-height:70px;" />
      <div class="text-lg font-bold mb-2 tracking-widest text-gray-700">LOGO</div>
    </div>
    <h1 class="text-2xl font-bold text-blue-700 mb-6 text-center">Registro de Usuario con Equipos</h1>
    <form @submit.prevent="registrar" class="space-y-3">
      <div style="margin-bottom: 18px; background: #e0f2fe; padding: 10px; border-radius: 6px;">
        <label class="block font-semibold mb-1 text-blue-800">Tipo de Registro <span style='color:red'>*</span></label>
        <select v-model="tipoRegistro" class="border-2 border-blue-400 rounded px-4 py-2 w-full bg-white">
          <option value="">Seleccione</option>
          <option value="registrado">Registrado</option>
          <option value="registrar">Registrar</option>
        </select>
      </div>
      <template v-if="tipoRegistro === 'registrado'">
        <div>
          <label class="block font-semibold mb-1">Tipo de Documento</label>
          <select v-model="tipoDocumento" class="border rounded px-4 py-2 w-full">
            <option value="">Seleccione</option>
            <option value="cc">Cédula</option>
            <option value="ti">Tarjeta de Identidad</option>
            <option value="ce">Cédula Extranjera</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold mb-1">Documento</label>
          <input v-model="documento" class="w-full border rounded px-2 py-1" placeholder="Número" />
        </div>
      </template>
      <template v-else-if="tipoRegistro === 'registrar'">
        <div>
          <label class="block font-semibold mb-1">Tipo de Usuario</label>
          <select v-model="tipoUsuario" class="border rounded px-4 py-2 w-full">
            <option value="">Seleccione</option>
            <option value="estudiante">Estudiante</option>
            <option value="docente">Docente</option>
            <option value="visitante">Visitante</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold mb-1">Tipo de Documento</label>
          <select v-model="tipoDocumento" class="border rounded px-4 py-2 w-full">
            <option value="">Seleccione</option>
            <option value="cc">Cédula</option>
            <option value="ti">Tarjeta de Identidad</option>
            <option value="ce">Cédula Extranjera</option>
          </select>
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block font-semibold mb-1">Nombre</label>
            <input v-model="nombre" class="w-full border rounded px-2 py-1" placeholder="Nombre completo" />
          </div>
          <div class="flex-1">
            <label class="block font-semibold mb-1">Documento</label>
            <input v-model="documento" class="w-full border rounded px-2 py-1" placeholder="Número" />
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-1">Teléfono</label>
          <input v-model="telefono" class="w-full border rounded px-2 py-1" placeholder="Teléfono" />
        </div>
        <div class="flex gap-2">
          <div class="flex-1">
            <label class="block font-semibold mb-1">Serial del Equipo</label>
            <input v-model="serialEquipo" class="w-full border rounded px-2 py-1" placeholder="Serial" />
          </div>
          <div class="flex-1">
            <label class="block font-semibold mb-1">Marca del Equipo</label>
            <input v-model="marcaEquipo" class="w-full border rounded px-2 py-1" placeholder="Marca" />
          </div>
        </div>
        <div>
          <label class="block font-semibold mb-1">Características</label>
          <input v-model="caracteristicas" class="w-full border rounded px-2 py-1" placeholder="Ej: color, RAM, etc." />
        </div>
        <div class="flex gap-4 mb-2">
          <label class="flex items-center"><input type="checkbox" v-model="mouse" class="mr-2" /> Mouse</label>
          <label class="flex items-center"><input type="checkbox" v-model="cargador" class="mr-2" /> Cargador</label>
        </div>
      </template>
      <div v-if="exito" class="mb-2 text-green-600 font-semibold flex items-center">
        <span class="mr-2">&#9679;</span> El registro ha sido exitoso
      </div>
      <div v-if="error" class="mb-2 text-red-600 font-semibold flex items-center">
        <span class="mr-2">&#9888;</span> {{ error }}
      </div>
      <div class="flex flex-col items-center mt-4">
        <div class="mb-2" style="height:40px;width:120px;background:#eee;border:1px solid #ccc;"> <!-- Simulación código de barras --> </div>
        <button type="submit" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mt-2 font-bold">Registrar</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'GuardForm',
  data() {
    return {
      tipoRegistro: '',
      tipoUsuario: '',
      tipoDocumento: '',
      nombre: '',
      documento: '',
      telefono: '',
      serialEquipo: '',
      marcaEquipo: '',
      caracteristicas: '',
      mouse: false,
      cargador: false,
      exito: false,
      error: ''
    }
  },
  methods: {
    registrar() {
      this.error = '';
      this.exito = false;
      if (!this.tipoRegistro) {
        this.error = 'Por favor, selecciona el tipo de registro.';
        return;
      }
      if (this.tipoRegistro === 'registrado') {
        if (!this.tipoDocumento || !this.documento) {
          this.error = 'Por favor, completa tipo y número de documento.';
          return;
        }
      } else if (this.tipoRegistro === 'registrar') {
        if (!this.tipoUsuario || !this.tipoDocumento || !this.nombre || !this.documento || !this.telefono || !this.serialEquipo || !this.marcaEquipo) {
          this.error = 'Por favor, completa todos los campos obligatorios.';
          return;
        }
      }
      // Aquí iría la lógica para enviar los datos al backend
      this.exito = true;
      setTimeout(() => { this.exito = false }, 3000);
      // Limpiar campos si quieres
      // this.tipoUsuario = this.tipoDocumento = this.nombre = this.documento = this.telefono = this.serialEquipo = this.marcaEquipo = this.caracteristicas = '';
      // this.mouse = this.cargador = false;
    }
  }
}
</script>

<style scoped>
form input, form select {
  background: #f9fafb;
}
</style>
<script>
export default {
  name: 'GuardForm'
}
</script>
<style scoped>
</style>
