import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Equipments from '../views/Equipments.vue';
import { createTestingPinia } from '@pinia/testing';

// Mock the QRCode library
vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn().mockResolvedValue({}),
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,fake'),
    toString: vi.fn().mockResolvedValue('<svg>fake</svg>')
  }
}));

describe('Equipments.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Equipments, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: { id: 1, role: 'admin' },
                token: 'fake-token'
              }
            }
          })
        ]
      }
    });
  });

  it('renders correctly', () => {
    expect(wrapper.find('h2').text()).toBe('Gestión de Equipos');
    expect(wrapper.find('table').exists()).toBe(true);
  });

  it('shows add equipment modal when button is clicked', async () => {
    expect(wrapper.find('.bg-opacity-75').exists()).toBe(false);
    await wrapper.find('button').trigger('click');
    expect(wrapper.find('.bg-opacity-75').exists()).toBe(true);
  });

  it('validates form fields correctly', async () => {
    await wrapper.find('button').trigger('click');
    const form = wrapper.find('form');
    await form.trigger('submit');

    const errors = wrapper.findAll('.text-red-600');
    expect(errors.length).toBeGreaterThan(0);
  });

  it('generates QR code when button is clicked', async () => {
    const equipment = {
      _id: '1',
      serialNumber: 'TEST001',
      brand: 'Test Brand',
      description: 'Test Description',
      status: 'available'
    };

    await wrapper.setData({
      equipments: [equipment]
    });

    await wrapper.find('.text-blue-600').trigger('click');
    expect(wrapper.vm.selectedEquipment).toEqual(equipment);
    expect(wrapper.find('.text-lg.font-medium').text()).toBe('Código QR del Equipo');
  });
});
