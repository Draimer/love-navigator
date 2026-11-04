const { test } = require('node:test');
const assert = require('node:assert/strict');
const { questions, styles, calculate, summary } = require('../attachment-quiz.js');

// Independently specified answer fixtures: anxiety on odd, avoidance on even items;
// reverse-worded items at these fixed positions must invert the response.
const reversePositions = [3, 4, 9, 10, 15, 16, 21, 22];
function fixture(anxiety, avoidance) {
  return Array.from({ length: 24 }, (_, index) => {
    const raw = index % 2 === 0 ? anxiety : avoidance;
    return reversePositions.includes(index + 1) ? 6 - raw : raw;
  });
}

test('24 original prompts balance two dimensions and reverse-scored items', () => {
  assert.equal(questions.length, 24);
  assert.equal(new Set(questions.map(q => q.text)).size, 24);
  for (const axis of ['anxiety', 'avoidance']) {
    assert.equal(questions.filter(q => q.axis === axis).length, 12);
    assert.equal(questions.filter(q => q.axis === axis && q.reverse).length, 4);
  }
});

test('all four category fixtures produce the expected axes and complete guidance', () => {
  for (const [a, v, type] of [[1, 1, 'secure'], [5, 1, 'anxious'], [1, 5, 'avoidant'], [5, 5, 'mixed']]) {
    const result = calculate(fixture(a, v));
    assert.equal(result.type, type);
    assert.equal(result.anxiety, a === 1 ? 0 : 100);
    assert.equal(result.avoidance, v === 1 ? 0 : 100);
    assert.equal(result.nearBoundary, false);
    assert.equal(styles[type].practices.length, 3);
    assert.match(summary(result), /不是心理診斷/);
    assert.match(summary(result), /不是機率或百分位/);
  }
});

test('reverse answers change only their own dimension in the correct direction', () => {
  const answers = fixture(1, 1);
  answers[2] = 1; // Third item is a positively worded anxiety prompt.
  assert.equal(calculate(answers).anxiety, 8);
  assert.equal(calculate(answers).avoidance, 0);
  answers[3] = 1;
  assert.equal(calculate(answers).avoidance, 8);
});

test('exact midpoint and near-boundary classifications are disclosed', () => {
  const middle = calculate(Array(24).fill(3));
  assert.equal(middle.type, 'mixed');
  assert.equal(middle.anxiety, 50);
  assert.equal(middle.avoidance, 50);
  assert.equal(middle.nearBoundary, true);
  assert.match(summary(middle), /接近分類界線/);
  const below = fixture(3, 1);
  below[0] = 2;
  assert.equal(calculate(below).type, 'secure');
  assert.equal(calculate(below).nearBoundary, true);
  below[0] = 3;
  assert.equal(calculate(below).type, 'anxious');
});

test('incomplete, sparse, out-of-range and nonnumeric answers cannot produce a result', () => {
  const sparse = Array(24); sparse[0] = 3;
  for (const answers of [undefined, [], Array(23).fill(3), Array(25).fill(3), sparse,
    Array(24).fill(null), Array(24).fill(0), Array(24).fill(6), Array(24).fill('3'),
    Array(24).fill(NaN), Array(24).fill(2.5)]) {
    assert.throws(() => calculate(answers));
  }
});

test('changing an answer recalculates without mutating the supplied answers', () => {
  const answers = fixture(1, 1);
  const original = answers.slice();
  calculate(answers);
  assert.deepEqual(answers, original);
  assert.equal(calculate(fixture(5, 1)).type, 'anxious');
});
