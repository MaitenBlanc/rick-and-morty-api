describe('Flujo de Comentarios de Usuarios', () => {
  it('Permitir al usuario normal comentar un episodio', () => {
    // Pasos login usuario común
    cy.visit('auth/login');
    cy.get(':nth-child(1) > .form-control').type('prueba1@gmail.com');
    cy.get(':nth-child(2) > .form-control').type('Abc123');
    cy.get('.btn').click();
    cy.url().should('include', '/characters');

    // Ir a episodio 3
    cy.contains('Episodes').click();
    cy.url().should('include', '/episodes');
    cy.contains('Episode 3').click();

    // Generar texto para comentario
    const testComment = 'Comentario automatizado Cypress';

    // Buscar textarea y escribir el comentario
    cy.get('.form-control').should('be.visible').type(testComment);

    // Click en botón publicar
    cy.contains('button', 'Post').click();

    // Verificar comentario escrito
    cy.contains(testComment).should('be.visible');

    // Verificar textarea vacío
    cy.get('.form-control').should('have.value', '');
  });
});
