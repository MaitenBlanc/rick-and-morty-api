describe('Flujo de usuario común', () => {
  it('Iniciar sesión y NO tener acceso a Admin Panel', () => {
    // Entrar a la ruta
    cy.visit('auth/login');

    // Llenar inputs email y pass
    cy.get('input[type="email"').type('prueba1@gmail.com');
    cy.get('input[type="password"').type('Abc123');

    // Click botón sign in
    cy.get('button[type="submit"').click();

    // Verificar si url cambió al panel
    cy.url().should('include', '/characters');

    // Verificar que navbar NO muestre el admin panel
    cy.contains('Admin Panel').should('not.exist');

    // Verificar la foto de perfil en el navbar
    cy.get('img[alt="Profile Picture"]').should('be.visible');
  });
});
