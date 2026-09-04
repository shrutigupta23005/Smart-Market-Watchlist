const signalEngine = require('../src/services/signalEngine');
const assert = require('assert');

console.log('--- RUNNING SIGNAL ENGINE UNIT TESTS ---\n');

// Test Case 1: High Attention Event (Sharp drop, high unusualness, reversal, divergence)
console.log('Test 1: High Attention Event (Sudden drop + Reversal + Divergence)');
const result1 = signalEngine.evaluateStock({
  symbol: 'RELIANCE',
  currentPrice: 2850.00,
  snapshotPrice: 3000.00, // -5.0% move
  snapshotRank: 4,
  currentRank: 1, // jumped 3 spots
  snapshotTrend: 'up',
  currentTrend: 'down', // reversal!
  snapshotVolatility: 'low',
  currentVolatility: 'high', // 2 bucket jump
  trailingMean: 0.6,
  trailingStdDev: 0.8, // z-score = (5.0 - 0.6) / 0.8 = 5.5 -> capped 100
  benchmarkMove: 0.5, // divergence = -5.0 - 0.5 = -5.5%
  freshness: 'LIVE',
  personalizationMultiplier: 1.0,
  attentionThreshold: 70
});

console.log('Result 1 Score:', result1.attentionScore);
console.log('Result 1 Bucket:', result1.bucket);
console.log('Result 1 Fingerprint:', result1.fingerprint);
console.log('Result 1 Confidence:', result1.confidence);
console.log('Result 1 Reasons:', result1.reasons);

assert(result1.attentionScore >= 70, `Expected score >= 70, got ${result1.attentionScore}`);
assert.strictEqual(result1.bucket, 'MUST_SEE');
assert.strictEqual(result1.confidence, 'verified');
assert.strictEqual(result1.fingerprint, 'DIVERGENT_MOVE');
assert(result1.reasons.length >= 3, 'Expected at least 3 explainable reasons');
console.log('✓ Test 1 Passed!\n');

// Test Case 2: Quiet Stock / No Action (Small drift within normal noise)
console.log('Test 2: Quiet Stock (Small drift within noise)');
const result2 = signalEngine.evaluateStock({
  symbol: 'HDFC',
  currentPrice: 1642.00,
  snapshotPrice: 1640.00, // +0.12% move
  snapshotRank: 2,
  currentRank: 2,
  snapshotTrend: 'flat',
  currentTrend: 'flat',
  snapshotVolatility: 'medium',
  currentVolatility: 'medium',
  trailingMean: 0.5,
  trailingStdDev: 0.8,
  benchmarkMove: 0.1,
  freshness: 'LIVE',
  personalizationMultiplier: 1.0,
  attentionThreshold: 70
});

console.log('Result 2 Score:', result2.attentionScore);
console.log('Result 2 Bucket:', result2.bucket);
console.log('Result 2 IsMeaningful:', result2.isMeaningful);
console.log('Result 2 Reasons:', result2.reasons);

assert(result2.attentionScore < 40, `Expected score < 40, got ${result2.attentionScore}`);
assert.strictEqual(result2.bucket, 'NO_ACTION');
assert.strictEqual(result2.isMeaningful, false);
console.log('✓ Test 2 Passed!\n');

// Test Case 3: Stale / Delayed data sets confidence to "estimated"
console.log('Test 3: Stale / Delayed Data Confidence Tagging');
const result3 = signalEngine.evaluateStock({
  symbol: 'INFY',
  currentPrice: 1900.00,
  snapshotPrice: 1800.00,
  freshness: 'DELAYED',
  attentionThreshold: 70
});

console.log('Result 3 Freshness:', result3.freshness);
console.log('Result 3 Confidence:', result3.confidence);
assert.strictEqual(result3.confidence, 'estimated');
console.log('✓ Test 3 Passed!\n');

// Test Case 4: Personalization Multiplier reduces attention score
console.log('Test 4: Personalization Multiplier (Quieter over time)');
const result4Normal = signalEngine.evaluateStock({
  symbol: 'TCS',
  currentPrice: 4350.00,
  snapshotPrice: 4200.00, // +3.57%
  personalizationMultiplier: 1.0
});

const result4Quieted = signalEngine.evaluateStock({
  symbol: 'TCS',
  currentPrice: 4350.00,
  snapshotPrice: 4200.00,
  personalizationMultiplier: 0.75 // 25% dampening from feedback
});

console.log('Result 4 Normal Score:', result4Normal.attentionScore);
console.log('Result 4 Quieted Score:', result4Quieted.attentionScore);
assert(result4Quieted.attentionScore < result4Normal.attentionScore, 'Quieted score should be lower');
assert(
  result4Quieted.attentionScore === Math.round(result4Normal.rawScore * 0.75),
  'Score should match damped formula'
);
console.log('✓ Test 4 Passed!\n');

console.log('ALL SIGNAL ENGINE UNIT TESTS PASSED SUCCESSFULLY! 🎉');
