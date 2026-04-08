describe('Navegación mobile', () => {
  it('Mostrar menú hamburguesa en mobile', () => {
    // Device usado para testear
    cy.viewport('iphone-xr');

    // Inicio de sesión
    cy.visit('auth/login');
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');
    cy.get('.btn').click();
    cy.url().should('include', '/characters');

    // Ver si los links del navbar están ocultos
    cy.contains('Characters').should('not.be.visible');

    // Click en el botón hamburguesa
    cy.get('.navbar-toggler').click();

    // Verificar que el menú se haya desplegado y los links sean visibles
    cy.contains('Characters').should('be.visible');
  });
});
