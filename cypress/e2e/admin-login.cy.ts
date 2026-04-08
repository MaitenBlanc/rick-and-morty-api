describe('Flujo de Administrador', () => {
  it('Iniciar sesión y entrar al Admin Panel', () => {
    // Entrar a la ruta
    cy.visit('auth/login');

    // Llenar inputs email y pass
    cy.get(':nth-child(1) > .form-control').type('admin@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');

    // Click botón sign in
    cy.get('.btn').click();

    // Verificar si url cambió al panel
    cy.url().should('include', '/characters');

    // Verificar que navbar muestre el panel
    cy.contains('Admin Panel').should('be.visible');

    // Verificar el admin panel
    cy.contains('Admin Panel').click();
    cy.url().should('include', '/admin-dashboard');

    // Verificar el título del panel
    cy.contains('Admin Dashboard').should('be.visible');
  });
});
