<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-400 to-green-300">
    <div class="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
      <h2 class="text-3xl font-bold text-center text-blue-700 mb-6">Ingreso</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Tipo de usuario</label>
          <select v-model="tipoUsuario" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
            <option value="guard">Guardia</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <div v-if="tipoUsuario === 'guard'" class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Jornada</label>
          <select v-model="jornada" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
            <option value="">Seleccione una jornada</option>
            <option value="mañana">Mañana</option>
            <option value="tarde">Tarde</option>
            <option value="noche">Noche</option>
            <option value="fin de semana">Fin de semana</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold mb-2">Usuario / Documento</label>
          <input v-model="usuario" type="text" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Ingrese su usuario o documento" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 font-semibold mb-2">Contraseña</label>
          <input v-model="clave" type="password" required class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" placeholder="Ingrese su contraseña" />
        </div>
        <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition transform hover:scale-105 shadow-lg">
          Ingresar
        </button>
        <div v-if="error" class="mt-4 text-red-600 text-center font-semibold animate-pulse">
          {{ error }}
        </div>
      </form>
      <div class="mt-6 text-center">
        <router-link to="/registrar-guardia" class="text-blue-600 hover:underline font-semibold">¿No tienes cuenta? Regístrate aquí</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  name: 'LoginGuardiaVigilante',
  data() {
    return {
      tipoUsuario: 'guard',
      usuario: '',
      clave: '',
      jornada: '',
      error: ''
    }
  },
  methods: {
    async login() {
      this.error = ''
      if (this.tipoUsuario === 'admin') {
        // Admin de emergencia
        if (this.usuario === 'testAdmin123' && this.clave === 'Admin123') {
          this.$router.push('/admin-formulario')
          return
        }
        try {
          const res = await api.post('/admins/login', {
            username: this.usuario,
            password: this.clave
          })
          if (res.data && res.data.token) {
            localStorage.setItem('token', res.data.token)
            this.$router.push('/admin-formulario')
            // No recargar, solo navegar
          } else {
            this.error = 'Respuesta inesperada del servidor'
          }
        } catch (e) {
          this.error = e.response?.data?.message || 'Usuario o contraseña incorrectos'
        }
      } else {
        // GUARDIA
        try {
          const res = await api.post('/guards/login', {
            document: this.usuario,
            password: this.clave,
            shift: this.jornada
          })
          if (res.data && res.data.token) {
            localStorage.removeItem('token')
            localStorage.setItem('token', res.data.token)
            // Siempre que sea login de guardia, redirige al formulario de guardia
            this.$router.push('/formulario-guardia');
          } else {
            this.error = 'Respuesta inesperada del servidor'
          }
        } catch (e) {
          this.error = e.response?.data?.message || 'Usuario o contraseña incorrectos'
        }
      }
    }
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(30px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
