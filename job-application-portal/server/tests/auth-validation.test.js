const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
let lookups = 0, saves = 0;
class FakeUser {
  constructor(data) { Object.assign(this, data); this.id = 'fixture-user'; }
  static async findOne() { lookups++; return null; }
  async save() { saves++; }
}
const modelPath = require.resolve('../models/User');
const previous = require.cache[modelPath];
require.cache[modelPath] = { id: modelPath, filename: modelPath, loaded: true, exports: FakeUser };
const router = require('../routes/auth');
if (previous) require.cache[modelPath] = previous; else delete require.cache[modelPath];

test('authentication routes reject invalid input before database access', async context => {
  const app = express(); app.use(express.json()); app.use('/auth', router);
  const server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  context.after(() => new Promise(resolve => server.close(resolve)));
  const post = (route, data) => fetch('http://127.0.0.1:' + server.address().port + '/auth/' + route, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  const valid = { firstName: 'Maria', lastName: 'Cruz', username: 'maria123', email: 'maria@example.test', password: 'Example123', phone: '09123456789' };
  for (const invalid of [
    { phone: '' }, { phone: '0912345678' }, { phone: '091234567890' }, { phone: '09123abc789' },
    { email: 'bad@email' }, { firstName: '123' }, { password: 'weak' }, { dateOfBirth: '2099-01-01' },
    { dateOfBirth: '2000-02-30' }, { username: 'bad user' }, { phone: 9123456789 }, { email: {} },
  ]) {
    const response = await post('register', { ...valid, ...invalid });
    assert.equal(response.status, 400, JSON.stringify(invalid));
    assert.equal(lookups, 0); assert.equal(saves, 0);
  }
  for (const data of [{}, { username: 'admin' }, { username: 'admin', password: '   ' }, { username: 'bad@email', password: 'x' }, { username: 'admin', email: {}, password: 'x' }]) {
    const response = await post('login', data); assert.equal(response.status, 400);
    assert.equal(lookups, 0);
  }
  const response = await post('register', valid);
  assert.equal(response.status, 200); assert.equal(saves, 1);
  assert.equal((await response.json()).user.phone, '09123456789');
  const loginResponse = await post('login', { username: 'admin', password: 'legacy-password' });
  assert.equal(loginResponse.status, 400);
  assert.equal((await loginResponse.json()).msg, 'Invalid credentials');
  assert.equal(lookups, 3);
});
