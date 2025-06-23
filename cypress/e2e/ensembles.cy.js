


describe('Inscription utilisateur', () => {
  it('Un utilisateur peut créer un compte', () => {
    cy.visit('/signup'); // Remplace par la bonne route si nécessaire

    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="username"]').type('Testeur');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('input[name="confirm_password"]').type('Password123!');

    // Si upload photo : 
    // cy.get('input[name="photo_profil"]').attachFile('photo.jpg');

    cy.get('form').submit();

    // Vérifie redirection ou confirmation
    cy.url().should('include', '/dashboard'); // ou autre page d’arrivée
    cy.contains('Bienvenue, Testeur').should('exist');
  });
});