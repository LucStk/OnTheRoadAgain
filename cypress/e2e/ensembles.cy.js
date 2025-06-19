describe('Accès aux ensembles', () => {
  it('Un utilisateur anonyme voit seulement les ensembles ouverts', () => {
    cy.visit('/')
    cy.request('/api/ensembles/').then((res) => {
      expect(res.status).to.eq(200)
      res.body.forEach(e => {
        expect(e.visibility).to.eq('O')
      })
    })
  })

  it('Un utilisateur connecté voit ses ensembles privés', () => {
    cy.loginByJWT('user1', 'pass')
    cy.visit('/mes-ensembles')
    cy.request('/api/ensembles/').then((res) => {
      const titres = res.body.map(e => e.titre)
      expect(titres).to.include('User1\'s Ensemble')
    })
  })
})
