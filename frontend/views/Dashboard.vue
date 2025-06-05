<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header v-if="isAuthenticated" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <Shield class="h-8 w-8 text-blue-600 mr-3" />
            <h1 class="text-xl font-semibold text-gray-900">Sistema de Control de Acceso</h1>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">
              {{ currentUser.role === 'admin' ? 'Administrador' : 'Guardia' }}: {{ currentUser.name }}
            </span>
            <button @click="logout" class="text-red-600 hover:text-red-800">
              <LogOut class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav v-if="isAuthenticated" class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8">
          <button
            v-for="tab in availableTabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <component :is="tab.icon" class="h-4 w-4 inline mr-2" />
            {{ tab.name }}
          </button>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <Loader2 class="h-8 w-8 text-blue-600 animate-spin" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 p-4 rounded-md">
        <div class="flex">
          <AlertCircle class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">Error</h3>
            <div class="mt-2 text-sm text-red-700">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Content based on active tab -->
      <div v-else>
        <!-- Dashboard Overview -->
        <div v-if="activeTab === 'dashboard'" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <Users class="h-6 w-6 text-gray-400" />
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total Usuarios
                    </dt>
                    <dd class="flex items-baseline">
                      <div class="text-2xl font-semibold text-gray-900">
                        <!-- Add actual count here -->
                        0
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Add more dashboard cards here -->
        </div>

        <!-- Users Section -->
        <div v-else-if="activeTab === 'users'">
          <router-view name="users"></router-view>
        </div>

        <!-- Guards Section -->
        <div v-else-if="activeTab === 'guards'">
          <router-view name="guards"></router-view>
        </div>

        <!-- Equipment Section -->
        <div v-else-if="activeTab === 'equipment'">
          <router-view name="equipment"></router-view>
        </div>

        <!-- History Section -->
        <div v-else-if="activeTab === 'history'">
          <router-view name="history"></router-view>
        </div>

        <!-- Settings Section -->
        <div v-else-if="activeTab === 'settings'">
          <!-- Add settings content here -->
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Shield, LogOut, Users, UserPlus, History, Settings, Clock, Plus, Edit, Trash2, 
  QrCode, FileSpreadsheet, FileText, AlertCircle, Loader2, Search
} from 'lucide-vue-next'

export default {
  name: 'AccessControlSystem',
  components: {
    Shield, LogOut, Users, UserPlus, History, Settings, Clock, Plus, Edit, Trash2,
    QrCode, FileSpreadsheet, FileText, AlertCircle, Loader2, Search
  },
  setup() {
    const router = useRouter()
    const isAuthenticated = ref(true)
    const currentUser = ref({
      name: 'Usuario Demo',
      role: 'admin'
    })
    const activeTab = ref('dashboard')
    
    const availableTabs = computed(() => [
      {
        id: 'dashboard',
        name: 'Dashboard',
        icon: Shield,
        show: true
      },
      {
        id: 'users',
        name: 'Usuarios',
        icon: Users,
        show: currentUser.value.role === 'admin'
      },
      {
        id: 'guards',
        name: 'Guardias',
        icon: UserPlus,
        show: currentUser.value.role === 'admin'
      },
      {
        id: 'equipment',
        name: 'Equipos',
        icon: FileSpreadsheet,
        show: true
      },
      {
        id: 'history',
        name: 'Historial',
        icon: History,
        show: true
      },
      {
        id: 'settings',
        name: 'Configuración',
        icon: Settings,
        show: currentUser.value.role === 'admin'
      }
    ].filter(tab => tab.show))

    const loading = ref(false)
    const error = ref(null)

    const logout = async () => {
      try {
        // Implementar la lógica de cierre de sesión aquí
        await router.push('/login')
      } catch (err) {
        console.error('Error al cerrar sesión:', err)
      }
    }

    onMounted(() => {
      // Cargar datos iniciales si es necesario
    })

    return {
      isAuthenticated,
      currentUser,
      activeTab,
      availableTabs,
      loading,
      error,
      logout
    }
  }
}
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
