import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('combines conditional and nested class names', () => {
    expect(
      cn('flex', ['items-center', { hidden: false, rounded: true }], null, undefined, false)
    ).toBe('flex items-center rounded');
  });
  it('allows a caller to override conflicting Tailwind classes', () => {
    expect(cn('p-4 text-red-500', 'p-2 text-blue-500')).toBe('p-2 text-blue-500');
  });
  it('keeps independent responsive variants', () => {
    expect(cn('p-4 md:p-6', 'p-2')).toBe('md:p-6 p-2');
  });
  it('returns an empty string without classes', () => {
    expect(cn()).toBe('');
  });
});
