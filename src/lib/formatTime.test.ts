import { describe, expect, it } from 'vitest';
import { formatTime } from './formatTime';

describe('formatTime', () => {
  it.each([
    [0, '00:00'],
    [9, '00:09'],
    [59, '00:59'],
    [60, '01:00'],
    [61, '01:01'],
    [1500, '25:00'],
    [3600, '60:00'],
    [6000, '100:00'],
  ])('formats %i seconds as %s', (seconds, expected) => {
    expect(formatTime(seconds)).toBe(expected);
  });
});
