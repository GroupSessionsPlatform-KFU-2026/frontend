import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('accepts user input and emits changes', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" onChange={onChange} />);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Ivan');
    expect(screen.getByRole('textbox')).toHaveValue('Ivan');
    expect(onChange).toHaveBeenCalledTimes(4);
  });
  it('does not accept input while disabled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Name" disabled onChange={onChange} />);
    await user.type(screen.getByRole('textbox'), 'Ivan');
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onChange).not.toHaveBeenCalled();
  });
  it('preserves the accessible error description', () => {
    render(
      <>
        <Input aria-label="Email" aria-invalid="true" aria-describedby="email-error" />
        <p id="email-error">Invalid email</p>
      </>
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('textbox')).toHaveAccessibleDescription('Invalid email');
  });
});
