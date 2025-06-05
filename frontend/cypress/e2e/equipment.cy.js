describe('Equipment Management', () => {
  beforeEach(() => {
    // Log in before each test
    cy.visit('/');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('admin123');
    cy.get('select').select('admin');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    
    // Navigate to equipment page
    cy.visit('/equipments');
  });

  it('shows equipment list and can add new equipment', () => {
    // Check if page loaded correctly
    cy.contains('h2', 'Gestión de Equipos').should('be.visible');
    
    // Test adding new equipment
    cy.contains('button', 'Nuevo Equipo').click();
    cy.get('input[placeholder*="Serie"]').type('TEST-001');
    cy.get('input[placeholder*="Marca"]').type('Test Brand');
    cy.get('textarea').type('Test Description');
    cy.get('input[placeholder*="Accesorio"]').type('Test Accessory');
    cy.contains('button', 'Guardar').click();

    // Verify equipment was added
    cy.contains('TEST-001').should('be.visible');
  });

  it('can edit existing equipment', () => {
    cy.get('button[title="Editar"]').first().click();
    cy.get('input[placeholder*="Marca"]').clear().type('Updated Brand');
    cy.contains('button', 'Actualizar').click();
    cy.contains('Updated Brand').should('be.visible');
  });

  it('can generate and download QR code', () => {
    cy.get('button[title="Generar QR"]').first().click();
    cy.contains('Código QR del Equipo').should('be.visible');
    cy.contains('button', 'PNG').should('be.visible');
    cy.contains('button', 'SVG').should('be.visible');
  });

  it('can delete equipment', () => {
    cy.get('button[title="Eliminar"]').first().click();
    cy.on('window:confirm', () => true);
    cy.contains('TEST-001').should('not.exist');
  });
});
