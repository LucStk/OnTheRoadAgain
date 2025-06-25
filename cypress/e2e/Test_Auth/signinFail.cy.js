/// <reference types="cypress" />
import { alice, generateRandomUser } from '../../support/users';

context('Signin', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.visit('/')
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.get('#dropdown-login-menu').contains('Sign in').click()
    cy.contains("Sign up").click()
  })
  it('Signin échoue car pas d\'email', () => {
    cy.intercept('POST', '/api/signup', (req) => {
      req.credentials = 'include';  // ou req.headers['credentials'] = 'include';
    }).as('loginRequest');

    cy.get('#username').type(alice.username)
    cy.get('.field-cont > #email').type(alice.email )
    cy.get('.field-cont >#password').type(alice.password)
    cy.get('.field-cont >#confirmpassword').type(alice.password)
   
    cy.contains('Créer l\'utilisateur').click()
    
    cy.wait('@loginRequest').its('response.statusCode').should('eq', 400);
    cy.contains('Cet email est déjà utilisé').should('exist')
    cy.contains('Ce nom d\'utilisateur est déjà pris').should('exist')
  })
})