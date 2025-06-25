/// <reference types="cypress" />
import { alice, generateRandomUser } from '../../support/users';

context('Signin', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.visit('/')
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.get('#dropdown-login-menu').contains('Sign in').click()
    cy.contains("Sign up").click()
  })
  it('Signup avec utilisateur aléatoire', () => {
    const user = generateRandomUser()

    cy.intercept('POST', '/api/signup', (req) => {
      req.credentials = 'include'
    }).as('signupRequest')

    cy.get('#username').type(user.username)
    cy.get('.field-cont > #email').type(user.email)
    cy.get('.field-cont >#password').type(user.password)
    cy.get('.field-cont >#confirmpassword').type(user.password)

    cy.contains("Créer l'utilisateur").click()

    cy.wait('@signupRequest').its('response.statusCode').should('eq', 201)
    cy.getCookie('refresh').should('exist');
    cy.contains("Créer un utilisateur").should('not.exist')
    
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.contains('Sign out').should('exist')
  })

})