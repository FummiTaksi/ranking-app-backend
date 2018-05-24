const supertest = require('supertest')
const api = supertest('http://localhost:3003')

describe('When app is running', async() => {
  test(' main route returns 200', async () => {
    await api
      .get('/')
      .expect(200)
  })
})