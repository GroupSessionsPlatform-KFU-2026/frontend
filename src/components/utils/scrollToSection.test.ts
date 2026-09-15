import { describe, expect, it, vi } from 'vitest';
import { scrollToSection } from './scrollToSection';

describe('scrollToSection', () => {
  it('smoothly scrolls to the requested element', () => {
    const element = document.createElement('section');
    element.id = 'features';
    element.scrollIntoView = vi.fn();
    document.body.append(element);
    try {
      scrollToSection('features');
      expect(element.scrollIntoView).toHaveBeenCalledExactlyOnceWith({ behavior: 'smooth' });
    } finally {
      element.remove();
    }
  });
  it('does not throw when the section does not exist', () => {
    expect(() => scrollToSection('missing')).not.toThrow();
  });
});
