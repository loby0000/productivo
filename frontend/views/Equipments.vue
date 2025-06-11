<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">Gestión de Equipos</h2>
      <button @click="showAddModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
        <Plus class="h-5 w-5 mr-2" />
        Nuevo Equipo
      </button>
    </div>

    <!-- Tabla de equipos -->
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div class="overflow-hidden border-b border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Serial
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marca
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="equipment in equipments" :key="equipment._id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ equipment.serialNumber }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ equipment.brand }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900">{{ equipment.description }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="equipment.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ equipment.status === 'available' ? 'Disponible' : 'En uso' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button @click="generateQR(equipment)" class="text-blue-600 hover:text-blue-900 mr-2">
                      <QrCode class="h-5 w-5" />
                    </button>
                    <button @click="editEquipment(equipment)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                      <Edit class="h-5 w-5" />
                    </button>
                    <button @click="deleteEquipment(equipment._id)" class="text-red-600 hover:text-red-900">
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar equipo -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">{{ isEditing ? 'Editar' : 'Nuevo' }} Equipo</h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-500">
            <X class="h-6 w-6" />
          </button>
        </div>
        <form @submit.prevent="validateAndSave">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Serie *</label>
              <input 
                type="text" 
                v-model="equipmentForm.serialNumber"
                :class="{'border-red-300': errors.serialNumber}"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500" 
                required
              >
              <p v-if="errors.serialNumber" class="mt-1 text-sm text-red-600">{{ errors.serialNumber }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Marca *</label>
              <input 
                type="text" 
                v-model="equipmentForm.brand"
                :class="{'border-red-300': errors.brand}"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              >
              <p v-if="errors.brand" class="mt-1 text-sm text-red-600">{{ errors.brand }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción *</label>
              <textarea 
                v-model="equipmentForm.description"
                :class="{'border-red-300': errors.description}"
                rows="3" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                required
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700">Accesorios</label>
              <div v-for="(acc, index) in equipmentForm.accessories" :key="index" class="flex mt-2">
                <input 
                  type="text" 
                  v-model="equipmentForm.accessories[index]"
                  :class="{'border-red-300': errors.accessories && errors.accessories[index]}"
                  class="flex-1 border border-gray-300 rounded-md shadow-sm p-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                <button 
                  type="button" 
                  @click="removeAccessory(index)" 
                  class="ml-2 text-red-600 hover:text-red-700"
                  :disabled="equipmentForm.accessories.length === 1"
                >
                  <Trash2 class="h-5 w-5" />
                </button>
              </div>
              <p v-if="errors.accessories" class="mt-1 text-sm text-red-600">{{ errors.accessories }}</p>
              <button 
                type="button" 
                @click="addAccessory" 
                class="mt-2 text-blue-600 text-sm hover:text-blue-700"
              >
                + Agregar accesorio
              </button>
            </div>
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeModal" 
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              :disabled="isSubmitting" 
              class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              <span v-if="isSubmitting" class="mr-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal para código QR -->
    <div v-if="showQRModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium">Código QR del Equipo</h3>
          <button @click="showQRModal = false" class="text-gray-400 hover:text-gray-500">
            <X class="h-6 w-6" />
          </button>
        </div>
        
        <div class="border rounded-lg p-4 mb-4">
          <div class="text-sm text-gray-600 mb-2">
            <div><strong>Serial:</strong> {{ selectedEquipment?.serialNumber }}</div>
            <div><strong>Marca:</strong> {{ selectedEquipment?.brand }}</div>
          </div>
        </div>

        <div class="flex flex-col items-center">
          <div ref="qrContainer" class="mb-4"></div>
          <div class="flex space-x-3">
            <button 
              @click="downloadQR('png')" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Download class="h-5 w-5 mr-2 text-gray-500" />
              PNG
            </button>
            <button 
              @click="downloadQR('svg')" 
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Download class="h-5 w-5 mr-2 text-gray-500" />
              SVG
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus, Edit, Trash2, QrCode, Download, X } from 'lucide-vue-next'
import QRCode from 'qrcode'
import api from '../src/api'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()
const equipments = ref([])
const showAddModal = ref(false)
const showQRModal = ref(false)
const isEditing = ref(false)
const qrContainer = ref(null)
const selectedEquipment = ref(null)
const equipmentForm = ref({
  serialNumber: '',
  brand: '',
  description: '',
  accessories: [''],
  status: 'available'
})
const errors = ref({})
const isSubmitting = ref(false)

const fetchEquipments = async () => {
  try {
    const response = await api.get('/equipments')
    equipments.value = response.data
  } catch (error) {
    console.error('Error fetching equipments:', error)
  }
}

const saveEquipment = async () => {
  try {
    if (isEditing.value) {
      await api.put(`/equipments/${equipmentForm.value._id}`, equipmentForm.value)
    } else {
      await api.post('/equipments', equipmentForm.value)
    }
    showAddModal.value = false
    await fetchEquipments()
    resetForm()
  } catch (error) {
    console.error('Error saving equipment:', error)
  }
}

const editEquipment = (equipment) => {
  equipmentForm.value = { ...equipment }
  isEditing.value = true
  showAddModal.value = true
}

const deleteEquipment = async (id) => {
  if (confirm('¿Estás seguro de eliminar este equipo?')) {
    try {
      await api.delete(`/equipments/${id}`)
      await fetchEquipments()
    } catch (error) {
      console.error('Error deleting equipment:', error)
    }
  }
}

const generateQR = async (equipment) => {
  selectedEquipment.value = equipment
  showQRModal.value = true

  try {
    // Clear previous QR code
    if (qrContainer.value) {
      qrContainer.value.innerHTML = ''
    }

    const qrData = JSON.stringify({
      id: equipment._id,
      serial: equipment.serialNumber,
      brand: equipment.brand,
      timestamp: new Date().toISOString()
    })

    await QRCode.toCanvas(qrContainer.value, qrData, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000',
        light: '#fff'
      }
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
  }
}

const downloadQR = async (format) => {
  if (!selectedEquipment.value) return

  try {
    const qrData = JSON.stringify({
      id: selectedEquipment.value._id,
      serial: selectedEquipment.value.serialNumber,
      brand: selectedEquipment.value.brand,
      timestamp: new Date().toISOString()
    })

    const fileName = `qr-${selectedEquipment.value.serialNumber}-${new Date().toISOString().slice(0,10)}`

    if (format === 'png') {
      const dataUrl = await QRCode.toDataURL(qrData, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000',
          light: '#fff'
        }
      })

      const link = document.createElement('a')
      link.download = `${fileName}.png`
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else if (format === 'svg') {
      const svgString = await QRCode.toString(qrData, {
        type: 'svg',
        width: 512,
        margin: 2,
        color: {
          dark: '#000',
          light: '#fff'
        }
      })

      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.download = `${fileName}.svg`
      link.href = url
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Error downloading QR code:', error)
  }
}

const addAccessory = () => {
  equipmentForm.value.accessories.push('')
}

const removeAccessory = (index) => {
  equipmentForm.value.accessories.splice(index, 1)
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validar número de serie
  if (!equipmentForm.value.serialNumber.trim()) {
    errors.value.serialNumber = 'El número de serie es requerido'
    isValid = false
  } else if (!/^[A-Za-z0-9-]+$/.test(equipmentForm.value.serialNumber)) {
    errors.value.serialNumber = 'El número de serie solo puede contener letras, números y guiones'
    isValid = false
  }

  // Validar marca
  if (!equipmentForm.value.brand.trim()) {
    errors.value.brand = 'La marca es requerida'
    isValid = false
  }

  // Validar descripción
  if (!equipmentForm.value.description.trim()) {
    errors.value.description = 'La descripción es requerida'
    isValid = false
  } else if (equipmentForm.value.description.length < 10) {
    errors.value.description = 'La descripción debe tener al menos 10 caracteres'
    isValid = false
  }

  // Validar accesorios
  const validAccessories = equipmentForm.value.accessories.filter(acc => acc.trim())
  if (validAccessories.length === 0) {
    errors.value.accessories = 'Debe agregar al menos un accesorio'
    isValid = false
  }

  return isValid
}

const validateAndSave = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    await saveEquipment()
  } finally {
    isSubmitting.value = false
  }
}

const closeModal = () => {
  if (isSubmitting.value) return
  showAddModal.value = false
  resetForm()
  errors.value = {}
}

const resetForm = () => {
  equipmentForm.value = {
    serialNumber: '',
    brand: '',
    description: '',
    accessories: [''],
    status: 'available'
  }
  isEditing.value = false
  errors.value = {}
}

onMounted(fetchEquipments)
</script>
