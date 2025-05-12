const request = require('supertest');
const app = require('../app');

// Test de santé de l'API
describe('API Health Check', () => {
  it('should return status 200 and OK message', async () => {
    const response = await request(app).get('/api/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});

// Test des routes d'items
describe('Items API', () => {
  let createdItemId;

  // Test pour créer un item
  it('should create a new item', async () => {
    const response = await request(app)
      .post('/api/items')
      .send({
        name: 'Test Item',
        description: 'This is a test item'})
      })
})