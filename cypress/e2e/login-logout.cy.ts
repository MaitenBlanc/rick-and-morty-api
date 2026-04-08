describe('Flujo login y logout', () => {
  it('Login y logout', () => {
    // Pasos login usuario común
    cy.visit('auth/login');
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');
    cy.get('.btn').click();
    cy.url().should('include', '/characters');

    // Buscar botón logout y clickearlo
    cy.contains('Log Out').should('be.visible').click();

    // Validar que salió
    cy.url().should('include', '/auth/login');

    // Leer que el token en localstorage ya no existe
    cy.window().its('localStorage.token').should('be.undefined');
  });
});
