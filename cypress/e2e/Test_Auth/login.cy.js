/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Navbar and User', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Login from navbar', () => {
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.get('#dropdown-login-menu').contains('Sign in')
    cy.get('#login-ref').click()
    cy.url().should('include', '/login')

    cy.intercept('POST', '/api/token/', (req) => {
      req.credentials = 'include';  // ou req.headers['credentials'] = 'include';
    }).as('loginRequest');
    cy.get('#dropdown-login-menu').should('not.exist')
    cy.get('#email').type(alice.email)
    cy.get('#password').type(alice.password)
    cy.get('button[type="submit"]').click()
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
    cy.getCookie('refresh').should('exist');
    cy.url().should('include', '/')
    
    // Vérifier que la navbar est bien updaté
    cy.get('#dropdown-notification').click()
    cy.get('#dropdown-notification-menu').should('be.visible')
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')

  })

})