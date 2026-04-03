describe('Login Smoke Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('signs in with valid credentials', () => {
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password');
    cy.get('button[type="submit"]').click();

    // Check redirection and no error
    cy.url().should('not.include', '/login');
    cy.get('.error-message').should('not.exist');
  });

  it('shows an error for invalid login', () => {
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    // Check error shown
    cy.get('.error-message').should('be.visible');
  });
});
