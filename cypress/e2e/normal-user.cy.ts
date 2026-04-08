describe('Flujo de usuario común', () => {
  it('Iniciar sesión y NO tener acceso a Admin Panel', () => {
    // Entrar a la ruta
    cy.visit('auth/login');

    // Llenar inputs email y pass
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');

    // Click botón sign in
    cy.get('.btn').click();

    // Verificar si url cambió al panel
    cy.url().should('include', '/characters');

    // Verificar que navbar NO muestre el admin panel
    cy.contains('Admin Panel').should('not.exist');

    // Verificar la foto de perfil en el navbar
    cy.get('.rounded-circle').should('be.visible');
  });
});
