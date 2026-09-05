const assert = require('assert');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const connectDB = require('../src/config/db');
const env = require('../src/config/env');
const app = require('../src/app');
const WatchlistItem = require('../src/models/WatchlistItem');
const Snapshot = require('../src/models/Snapshot');

// Helper to simulate HTTP requests against express app
const request = async (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const http = require('http');
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = body ? JSON.stringify(body) : null;
      if (payload) headers['Content-Length'] = Buffer.byteLength(payload);

      const req = http.request({
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers
      }, (res) => {
        let raw = '';
        res.on('data', chunk => { raw += chunk; });
        res.on('end', () => {
          server.close();
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      });

      req.on('error', (err) => {
        server.close();
        reject(err);
      });

      if (payload) req.write(payload);
      req.end();
    });
  });
};

async function runTests() {
  console.log('--- STARTING GUEST AUTH & DEMO FLOW TESTS ---\n');
  await connectDB();

  // Test 1: Guest Login (Instant Demo Access)
  console.log('Test 1: POST /api/auth/guest (Instant Demo Access)');
  const guestRes = await request('POST', '/api/auth/guest');
  assert.strictEqual(guestRes.status, 200, `Expected 200, got ${guestRes.status}`);
  assert.strictEqual(guestRes.body.success, true);
  assert(guestRes.body.data.token, 'Token must be returned');
  assert.strictEqual(guestRes.body.data.email, 'guest@signal.market');
  assert.strictEqual(guestRes.body.data.name, 'Demo Guest');

  const guestToken = guestRes.body.data.token;
  const decoded = jwt.verify(guestToken, env.JWT_SECRET);
  assert(decoded.id, 'JWT must decode with valid user id');
  const guestUserId = decoded.id;

  // Verify watchlist items in DB
  const watchlistCount = await WatchlistItem.countDocuments({ userId: guestUserId, isActive: true });
  assert.strictEqual(watchlistCount, 18, `Expected 18 demo stocks, found ${watchlistCount}`);

  // Verify snapshot in DB
  const latestSnapshot = await Snapshot.findOne({ userId: guestUserId, isLatest: true });
  assert(latestSnapshot, 'Guest must have a latest snapshot');
  assert.strictEqual(latestSnapshot.entries.length, 18, 'Snapshot must have 18 entries');
  console.log('✓ Test 1 Passed: Guest account created and seeded with 18 assets & snapshot!\n');

  // Test 2: Away Summary for Guest
  console.log('Test 2: GET /api/away-summary with Guest Token');
  const summaryRes = await request('GET', '/api/away-summary', null, guestToken);
  assert.strictEqual(summaryRes.status, 200);
  assert.strictEqual(summaryRes.body.success, true);
  const summary = summaryRes.body.data;
  assert(summary.mustSee.length > 0, 'Guest must have MUST SEE alerts (e.g. RELIANCE)');
  const relianceAlert = summary.mustSee.find(a => a.symbol === 'RELIANCE');
  assert(relianceAlert, 'RELIANCE must be in MUST SEE');
  assert(relianceAlert.attentionScore >= 70, 'RELIANCE attention score must be >= 70');
  assert.strictEqual(summary.awayDuration.days, 2);
  assert.strictEqual(summary.awayDuration.hours, 4);
  console.log('✓ Test 2 Passed: Guest immediately receives realistic demo signals (RELIANCE MUST SEE)!\n');

  // Test 3: Normal Signup
  console.log('Test 3: POST /api/auth/signup for standard registration');
  const testEmail = `judge_${Date.now()}@example.com`;
  const signupRes = await request('POST', '/api/auth/signup', {
    name: 'Judge User',
    email: testEmail,
    password: 'securePassword999!'
  });
  assert.strictEqual(signupRes.status, 201);
  assert.strictEqual(signupRes.body.success, true);
  assert.strictEqual(signupRes.body.data.email, testEmail);
  assert(signupRes.body.data.token, 'Signup must return token');
  console.log('✓ Test 3 Passed: Standard user registration works properly!\n');

  // Test 4: Normal Login (valid and invalid credentials)
  console.log('Test 4: POST /api/auth/login for standard user');
  const loginRes = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: 'securePassword999!'
  });
  assert.strictEqual(loginRes.status, 200);
  assert.strictEqual(loginRes.body.success, true);
  assert(loginRes.body.data.token, 'Login must return token');

  const failLoginRes = await request('POST', '/api/auth/login', {
    email: testEmail,
    password: 'wrongpassword'
  });
  assert.strictEqual(failLoginRes.status, 401);
  console.log('✓ Test 4 Passed: Normal login verifies password correctly and rejects invalid password!\n');

  // Test 5: Scenario switching (Silence mode)
  console.log('Test 5: Switch scenario to "nothing_happened" for Guest');
  const seedRes = await request('POST', '/api/demo/seed?mode=nothing_happened', null, guestToken);
  assert.strictEqual(seedRes.status, 200);

  const silenceSummaryRes = await request('GET', '/api/away-summary', null, guestToken);
  assert.strictEqual(silenceSummaryRes.body.data.nothingHappened, true);
  assert.strictEqual(silenceSummaryRes.body.data.mustSee.length, 0);
  console.log('✓ Test 5 Passed: Silence scenario toggle works for Guest session!\n');

  // Test 6: Fresh Guest access resets to rich signals
  console.log('Test 6: Repeat Guest Access resets state to rich signals');
  const freshGuestRes = await request('POST', '/api/auth/guest');
  assert.strictEqual(freshGuestRes.status, 200);
  const freshSummaryRes = await request('GET', '/api/away-summary', null, freshGuestRes.body.data.token);
  assert.strictEqual(freshSummaryRes.body.data.nothingHappened, false);
  assert(freshSummaryRes.body.data.mustSee.length > 0, 'Must have rich signals');
  console.log('✓ Test 6 Passed: Repeat guest entry reliably resets to full rich signals!\n');

  console.log('ALL GUEST AUTH & DEMO FLOW TESTS PASSED! 🎉');
  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test Failed:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
