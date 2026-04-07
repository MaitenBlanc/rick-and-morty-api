describe('Prueba de seguridad y route guards', () => {
  it('Bloquear acceso a Admin Panel sin estar logueado', () => {
    // Ir directo al panel (url protegida)
    cy.visit('/admin-dashboard');

    // Verificar si redirigió al login
    cy.url().should('include', '/auth/login');
  });

  it('Bloquear acceso a Admin Panel a un usuario común', () => {
    // Pasos login usuario común
    cy.visit('auth/login');
    cy.get('input[type="email"').type('prueba1@gmail.com');
    cy.get('input[type="password"').type('Abc123');
    cy.get('button[type="submit"').click();
    cy.url().should('include', '/characters');

    // Ir a admin panel (no debería poderse)
    cy.visit('/admin-dashboard');

    // Verificar que el AdminGuard devuelva a /characters
    cy.url().should('include', '/characters');
    cy.contains('Admin Panel').should('not.exist');
  });
});
