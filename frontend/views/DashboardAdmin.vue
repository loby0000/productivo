
<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <!-- Sidebar -->
      <aside class="w-64 bg-white shadow-lg flex flex-col items-center py-8">
        <div class="mb-6 flex flex-col items-center">
          <div class="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <span class="material-icons text-5xl text-gray-400">person</span>
          </div>
          <div class="font-bold text-lg">{{ adminName }}</div>
          <div class="text-sm text-gray-600">{{ adminDocument }}</div>
        </div>
        <nav class="flex flex-col gap-4 w-full px-6">
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100 font-semibold" @click="$router.push('/')">Dashboard</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/users')">Gestion usuarios</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/guards')">Gestion Guardias</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/history')">Historial</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/equipments')">Control Equipos</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/notifications')">Notificaciones</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="$router.push('/logs')">Logs Auditoría</button>
          <button class="text-left py-2 px-4 rounded hover:bg-gray-100" @click="logout">Cerrar Sesión</button>
        </nav>
      </aside>
      <!-- Main dashboard -->
      <main class="flex-1 p-8 grid grid-cols-3 gap-6">
        <!-- Métricas principales -->
        <div class="col-span-3 flex gap-6 mb-6">
          <div class="flex-1 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <div class="font-semibold text-lg mb-2">Usuarios Activos</div>
            <div class="text-3xl font-bold">{{ usuariosActivos }}</div>
          </div>
          <div class="flex-1 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <div class="font-semibold text-lg mb-2">Entradas del día</div>
            <div class="text-3xl font-bold">{{ entradasDia }}</div>
          </div>
          <div class="flex-1 bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
            <div class="font-semibold text-lg mb-2">Salidas del día</div>
            <div class="text-3xl font-bold">{{ salidasDia }}</div>
          </div>
        </div>
        <!-- Gráfico de barras -->
        <div class="col-span-2 bg-white rounded-lg shadow p-6 flex flex-col">
          <div class="flex justify-between items-center mb-2">
            <div class="font-semibold">Entradas/salidas x mes</div>
            <div class="text-sm">Año Actual</div>
            <button class="bg-gray-200 px-3 py-1 rounded" @click="$router.push('/history')">Historial</button>
          </div>
          <div class="flex-1 flex items-center justify-center">
            <!-- Simulación de gráfico de barras -->
            <div class="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
              <div v-for="mes in meses" :key="mes" class="h-24 w-4 mx-1 bg-blue-300" :style="{height: `${graficoMeses[mes]}%`}" />
            </div>
          </div>
          <div class="flex justify-between mt-2 text-xs text-gray-500">
            <span v-for="mes in meses" :key="mes">{{ mes }}</span>
          </div>
        </div>
        <!-- Calendario y entradas/salidas -->
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div class="flex gap-4 mb-2">
            <div class="bg-gray-100 rounded p-4 flex flex-col items-center">
              <div class="font-semibold">Entrada</div>
              <div class="text-2xl font-bold">{{ entradasDia }}</div>
            </div>
            <div class="bg-gray-100 rounded p-4 flex flex-col items-center">
              <div class="font-semibold">Salida</div>
              <div class="text-2xl font-bold">{{ salidasDia }}</div>
            </div>
          </div>
          <div class="w-full mb-2">
            <!-- Calendario simulado -->
            <div class="w-full h-24 bg-gray-100 rounded flex flex-col items-center justify-center">
              <div class="font-bold">December 2025</div>
              <div class="grid grid-cols-7 gap-1 text-xs mt-1">
                <span v-for="d in diasCalendario" :key="d">{{ d }}</span>
              </div>
            </div>
          </div>
          <button class="bg-blue-600 text-white px-4 py-2 rounded" @click="$router.push('/users')">Gestion Usuarios</button>
        </div>
        <!-- Guardias activos -->
        <div class="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <div class="font-semibold mb-2">Guardias Activos</div>
          <div class="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-2">
            <!-- Gráfico circular simulado -->
            <span class="text-2xl font-bold">{{ guardiasActivosPorcentaje }}%</span>
          </div>
          <div class="flex gap-2 text-xs">
            <span class="flex items-center"><span class="w-3 h-3 bg-black rounded-full mr-1"></span>Activos</span>
            <span class="flex items-center"><span class="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>Inactivos</span>
          </div>
          <button class="bg-gray-200 px-3 py-1 rounded mt-2" @click="$router.push('/guards')">Gestion Gu</button>
        </div>
      </main>
    </div>
  </div>
</template>


<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()

// Datos simulados para el dashboard
const adminName = 'Nombre Admin'
const adminDocument = 'Documento'
const usuariosActivos = 12
const entradasDia = 5
const salidasDia = 3
const guardiasActivosPorcentaje = 65
const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const graficoMeses = {
  enero: 40, febrero: 60, marzo: 80, abril: 50, mayo: 70, junio: 30, julio: 90, agosto: 60, septiembre: 50, octubre: 80, noviembre: 40, diciembre: 70
}
const diasCalendario = ['L','M','X','J','V','S','D',1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]

function logout() {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
/* Puedes agregar estilos personalizados aquí si lo deseas */
</style>
