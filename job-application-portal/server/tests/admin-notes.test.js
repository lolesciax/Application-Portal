const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

// Exercise the real route with an in-memory model and authenticated test user.
// No MongoDB connection, real account, or uploaded document is accessed.
const modelPath = require.resolve('../models/Application');
const authPath = require.resolve('../middleware/auth');
const previousModel = require.cache[modelPath];
const previousAuth = require.cache[authPath];
let currentApplication;
const auth = (req, res, next) => { req.user = { id: 'fixture-admin', role: 'admin' }; next(); };
auth.adminOnly = (req, res, next) => next();
require.cache[modelPath] = { id: modelPath, filename: modelPath, loaded: true, exports: { findById: async () => currentApplication } };
require.cache[authPath] = { id: authPath, filename: authPath, loaded: true, exports: auth };
const router = require('../routes/admin');
if (previousModel) require.cache[modelPath] = previousModel; else delete require.cache[modelPath];
if (previousAuth) require.cache[authPath] = previousAuth; else delete require.cache[authPath];

test('status updates can clear, trim, or preserve applicant-facing notes', async context => {
  const app = express(); app.use(express.json()); app.use('/admin', router);
  const server = await new Promise(resolve => { const listener = app.listen(0, '127.0.0.1', () => resolve(listener)); });
  context.after(() => new Promise(resolve => server.close(resolve)));
  const url = 'http://127.0.0.1:' + server.address().port + '/admin/applications/fixture/status';
  for (const [payload, expected] of [
    [{ status: 'pending', adminNotes: '' }, ''],
    [{ status: 'hired', adminNotes: '  Welcome aboard.  ' }, 'Welcome aboard.'],
    [{ status: 'pending' }, 'Existing note'],
  ]) {
    currentApplication = { status: 'pending', adminNotes: 'Existing note', save: async () => {} };
    const response = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).application.adminNotes, expected);
  }
});
