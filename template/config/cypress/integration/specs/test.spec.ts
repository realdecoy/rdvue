describe('Basic test', () => {
    it('successfully loads', () => {
      cy.visit('http://localhost:8080'); // change URL to match your dev URL
      // Enter test code here
      cy.get('.call-sign').should('contain', 'rdvue');

      cy.get('.features').contains('vuex');

    });
});