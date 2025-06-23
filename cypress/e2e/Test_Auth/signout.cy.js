/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Signout', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('#email').type(alice.email)
    cy.get('#password').type(alice.password)
    cy.get('button[type="submit"]').click()
  })
  it('Login from navbar', () => {
    cy.visit('/')
    cy.get('#dropdown-login').click()
    cy.get('#dropdown-login-menu').should('be.visible')
    cy.get('#dropdown-login-menu').contains('Sign out')
    //cy.get('#login-ref').click()
    //cy.url().should('include', '/signout')
  })
})