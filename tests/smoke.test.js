// Trivial smoke test to confirm the Jest harness runs (spec Task 1).
// Real unit tests for language/faq/escalation arrive in Tasks 3-5.

describe('test harness', () => {
  test('runs and can assert', () => {
    expect(1 + 1).toBe(2);
  });
});
