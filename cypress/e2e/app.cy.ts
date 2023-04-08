/// <reference types="cypress" />
describe('App', () => {
  beforeEach(() => cy.visit('/'));

  it('should get started to login', () => {
    const btnGetStarted = cy.get('button').contains('Get Started');

    btnGetStarted.should('be.visible').then(() => {
      btnGetStarted.click();
      cy.url().should('include', '/login');
    });
  });
});
