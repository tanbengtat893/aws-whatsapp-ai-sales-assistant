'use strict';

/**
 * Unit tests for the WhatsApp sender interface (spec Task 6, Req 7.1-7.3).
 */

const sender = require('../src/services/whatsapp/sender');
const simulated = require('../src/services/whatsapp/simulated.sender');
const cloud = require('../src/services/whatsapp/cloud.sender');

const ORIGINAL_MODE = process.env.WHATSAPP_MODE;

afterEach(() => {
  if (ORIGINAL_MODE === undefined) {
    delete process.env.WHATSAPP_MODE;
  } else {
    process.env.WHATSAPP_MODE = ORIGINAL_MODE;
  }
  simulated.clear();
});

describe('simulated.sender (Req 7.1)', () => {
  test('records an outbound message and returns it as delivered', async () => {
    const result = await simulated.send('customer_1', 'Your order is confirmed.');
    expect(result.delivered).toBe(true);
    expect(result.channel).toBe('simulated');
    expect(result.to).toBe('customer_1');
    expect(result.message).toBe('Your order is confirmed.');
    expect(typeof result.id).toBe('string');
    expect(typeof result.sentAt).toBe('string');
  });

  test('getSent returns recorded messages, filterable by recipient', async () => {
    await simulated.send('cust_a', 'first');
    await simulated.send('cust_b', 'second');
    await simulated.send('cust_a', 'third');
    expect(simulated.getSent()).toHaveLength(3);
    expect(simulated.getSent('cust_a')).toHaveLength(2);
    expect(simulated.getSent('cust_b')).toHaveLength(1);
  });

  test('does not deliver when recipient is missing (no crash)', async () => {
    const result = await simulated.send('', 'hello');
    expect(result.delivered).toBe(false);
    expect(result.error).toBe('missing_recipient');
    expect(simulated.getSent()).toHaveLength(0);
  });

  test('does not deliver an empty message', async () => {
    const result = await simulated.send('cust', '   ');
    expect(result.delivered).toBe(false);
    expect(result.error).toBe('empty_message');
  });

  test('clear empties the outbound log', async () => {
    await simulated.send('cust', 'msg');
    simulated.clear();
    expect(simulated.getSent()).toHaveLength(0);
  });
});

describe('cloud.sender stub (Req 7.2)', () => {
  test('send rejects with a not-configured error', async () => {
    await expect(cloud.send('cust', 'msg')).rejects.toThrow(/not configured/i);
  });

  test('the error carries a machine-readable code', async () => {
    await expect(cloud.send('cust', 'msg')).rejects.toMatchObject({
      code: 'WHATSAPP_CLOUD_NOT_CONFIGURED',
    });
  });

  test('exposes the cloud channel name', () => {
    expect(cloud.channel).toBe('cloud');
  });
});

describe('sender factory (Req 7.3 - swappable, no logic change)', () => {
  test('defaults to the simulated sender', () => {
    delete process.env.WHATSAPP_MODE;
    expect(sender.getMode()).toBe('simulated');
    expect(sender.getSender()).toBe(simulated);
  });

  test('selects the cloud sender when WHATSAPP_MODE=cloud', () => {
    process.env.WHATSAPP_MODE = 'cloud';
    expect(sender.getMode()).toBe('cloud');
    expect(sender.getSender()).toBe(cloud);
  });

  test('an unknown mode falls back to simulated', () => {
    process.env.WHATSAPP_MODE = 'carrier-pigeon';
    expect(sender.getMode()).toBe('simulated');
  });

  test('send() routes through the simulated sender by default', async () => {
    delete process.env.WHATSAPP_MODE;
    const result = await sender.send('cust', 'routed message');
    expect(result.delivered).toBe(true);
    expect(result.channel).toBe('simulated');
  });

  test('send() routes through the cloud stub when in cloud mode', async () => {
    process.env.WHATSAPP_MODE = 'cloud';
    await expect(sender.send('cust', 'routed message')).rejects.toThrow(
      /not configured/i
    );
  });

  test('both senders expose the same send() interface shape', () => {
    expect(typeof simulated.send).toBe('function');
    expect(typeof cloud.send).toBe('function');
  });
});
