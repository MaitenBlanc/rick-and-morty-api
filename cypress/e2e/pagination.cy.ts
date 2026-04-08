describe('Flujo de paginación', () => {
  it('Cargar la segunda página de personajes', () => {
    // Inicio de sesión
    cy.visit('auth/login');
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');
    cy.get('.btn').click();
    cy.url().should('include', '/characters');

    // Guardar el primer personaje de la página 1 para corroborar después
    cy.get(':nth-child(1) > app-character-card > .card > .card-body > .card-title')
      .first()
      .invoke('text')
      .as('firstCharacter');

    // Click en siguiente
    cy.contains('Next').click();

    // Comparar el primer personaje de la página 2 con el de la página 1
    cy.get('@firstCharacter').then((textPage1) => {
      cy.get(':nth-child(1) > app-character-card > .card > .card-body > .card-title')
        .first()
        .should('not.have.text', textPage1);
    });
  });
});
