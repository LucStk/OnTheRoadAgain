
/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Test Api', () => {
    it('Login', () => {
        cy.request({
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/token/',
        body: { email: alice.email, password: alice.password },
        withCredentials: true,
        }).as('loginRequest');
    })
})


