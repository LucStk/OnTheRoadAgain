/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Test Points', () => {
    beforeEach(() => {
        cy.request({
            method: 'POST',
            url: 'http://localhost:8000/api/token/',
            body: { email: alice.email, password: alice.password },
            withCredentials: true,
        }).as('loginRequest');
        cy.visit('/')
        
    })
    it('Logout', () => {
        cy.url().should('include', '/')
        cy.get('#dropdown-login').click()
        cy.get('#dropdown-login-menu').should('be.visible')
        cy.get('#dropdown-login-menu').contains('Sign out')
    })
})


