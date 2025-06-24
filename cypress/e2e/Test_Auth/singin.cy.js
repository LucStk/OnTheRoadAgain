/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Signin', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Signin from navbar', () => {
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.get('#dropdown-login-menu').contains('Sign in').click()

    cy.contains("Sign up").click()

    cy.intercept('POST', '/api/signup', (req) => {
      req.credentials = 'include';  // ou req.headers['credentials'] = 'include';
    }).as('loginRequest');

    cy.get('#username').type(alice.username)
    cy.get('.field-cont > #email').type(alice.email )
    cy.get('.field-cont >#password').type(alice.password)
    cy.get('.field-cont >#confirmpassword').type(alice.password)
   
    cy.contains('Créer l\'utilisateur').click()
    

    cy.wait('@loginRequest').its('response.statusCode').should('eq', 400);
    

  })

})