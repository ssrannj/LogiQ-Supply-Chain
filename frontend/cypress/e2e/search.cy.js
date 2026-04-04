describe('Catalog Search', () => {
    beforeEach(() => {
        // Login as customer to access the dashboard
        cy.visit('/login');
        cy.get('input[id="email"]').type('test@example.com');
        cy.get('input[id="password"]').type('password');
        cy.get('button[type="submit"]').click();

        // Should be on dashboard now
        cy.url().should('include', '/customer/dashboard');
    });

    it('displays search results for valid keyword', () => {
        const keyword = 'chair';
        cy.get('input[placeholder*="Search products"]').type(keyword);
        cy.get('button').contains('Search').click();

        // Should show results
        cy.get('h2').should('contain', `Search Results for "${keyword}"`);
        cy.get('.auth-card.card-hover').should('have.length.at.least', 1);
    });

    it('handles empty search keyword', () => {
        cy.get('input[placeholder*="Search products"]').clear();
        cy.get('button').contains('Search').click();

        // Should show all products or reload
        cy.get('h2').should('contain', 'Available Products');
    });

    it('shows message when no results are found', () => {
        const keyword = 'nonexistent-product-xyz';
        cy.get('input[placeholder*="Search products"]').type(keyword);
        cy.get('button').contains('Search').click();

        // Should show "No products found" message
        cy.contains('No products found').should('be.visible');
        cy.contains(`We couldn't find anything matching "${keyword}"`).should('be.visible');
    });
});
