describe('Flujo de búsqueda de personajes', () => {
  beforeEach(() => {
    cy.visit('auth/login');
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');
    cy.get('.btn').click();
    cy.url().should('include', '/characters');
  });

  it('Buscar personaje por nombre', () => {
    // Ver si página cargó los personajes
    cy.get(':nth-child(1) > app-character-card > .card', { timeout: 10000 }).should('have.length.greaterThan', 0);

    // Buscar el search y escribir rick
    cy.get('.form-control').first().type('morty');
    cy.contains('Search').click();

    // Varificar que al menos una card contenga el nombre
    cy.contains(':nth-child(1) > app-character-card > .card', 'Morty').should('be.visible');

    // Verificar que NO haya tarjetas con otro nombre
    cy.contains(':nth-child(1) > app-character-card > .card', 'Rick').should('not.exist');
  });
});
