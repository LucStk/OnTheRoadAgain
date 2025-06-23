/// <reference types="cypress" />
import { alice } from '../../support/users';

context('Navbar and User', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('Dropdown notification', () => {
    cy.get('#dropdown-notification').click()
    cy.get('#dropdown-notification-menu').should('be.visible')
  })

})
