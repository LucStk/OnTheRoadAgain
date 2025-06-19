Cypress.Commands.add('loginByJWT', (username, password) => {
  cy.request('POST', '/api/token/', { username, password })
    .its('body.access')
    .then((token) => {
      window.localStorage.setItem('token', token)
    })
})
