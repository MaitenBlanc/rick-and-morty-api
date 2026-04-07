describe('Flujo de Comentarios de Usuarios', () => {
  it('Permitir al usuario normal comentar un episodio', () => {
    // Pasos login usuario común
    cy.visit('auth/login');
    cy.get('input[type="email"').type('prueba1@gmail.com');
    cy.get('input[type="password"').type('Abc123');
    cy.get('button[type="submit"').click();
    cy.url().should('include', '/characters');

    // Ir a episodio 3
    cy.contains('Episodes').click();
    cy.url().should('include', '/episodes');
    cy.contains('Episode 3').click();

    // Generar texto para comentario
    const testComment = 'Comentario automatizado Cypress';

    // Buscar textarea y escribir el comentario
    cy.get('textarea[formControlName="content"').should('be.visible').type(testComment);

    // Click en botón publicar
    cy.contains('button', 'Post').click();

    // Verificar comentario escrito
    cy.contains(testComment).should('be.visible');

    // Verificar textarea vacío
    cy.get('textarea[formControlName="content"').should('have.value', '');
  });
});
