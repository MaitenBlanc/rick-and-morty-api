describe('Flujo de bloqueo de Comentarios', () => {
  it('Permite a un admin bloquear/desbloquear comentarios', () => {
    // Mismos pasos de admin-login
    cy.visit('auth/login');
    cy.get('input[type="email"').type('admin@gmail.com');
    cy.get('input[type="password"').type('Abc123');
    cy.get('button[type="submit"').click();
    cy.url().should('include', '/characters');

    // Ir a vista episodios
    cy.contains('Episodes').click();
    cy.url().should('include', '/episodes');

    // Ir al detalle del episodio 1
    cy.contains('Episode 1').click();
    cy.url().should('include', '/episodes/1');

    // Buscar botón bloquear/desbloquear
    cy.contains(/Disable Comments | Enable Comments/i).should('be.visible');
  });
});
