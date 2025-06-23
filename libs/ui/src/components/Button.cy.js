import Button from './Button.vue'

describe('Button', () => {
  it('renders correctly', () => {
    cy.mount(Button, {
      props: {
        label: 'Click Me',
      },
    })

    cy.contains('Click Me').should('exist')
  })
})