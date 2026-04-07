describe('Flujo login y logout', () => {
  it('Login y logout', () => {
    // Pasos login usuario común
    cy.visit('auth/login');
    cy.get('input[type="email"').type('prueba1@gmail.com');
    cy.get('input[type="password"').type('Abc123');
    cy.get('button[type="submit"').click();
    cy.url().should('include', '/characters');

    // Buscar botón logout y clickearlo
    cy.contains('Log Out').should('be.visible').click();

    // Validar que salió
    cy.url().should('include', '/auth/login');

    // Leer que el token en localstorage ya no existe
    cy.window().its('localStorage.token').should('be.undefined');
  });
});
