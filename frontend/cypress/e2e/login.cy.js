describe('Login Functionality', () => {
    it('successfully logs in with valid credentials', () => {
        cy.visit('/login');
        cy.get('input[id="email"]').type('test@example.com');
        cy.get('input[id="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Should be on dashboard now
        cy.url().should('include', '/customer/dashboard');
        cy.contains('Customer Dashboard').should('be.visible');
    });

    it('fails to login with invalid credentials', () => {
        cy.visit('/login');
        cy.get('input[id="email"]').type('wrong@example.com');
        cy.get('input[id="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Should show error message
        cy.contains('Failed to login').should('be.visible');
    });
});
