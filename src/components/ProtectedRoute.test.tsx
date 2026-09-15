import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

vi.mock('@/context/AuthContext', () => ({ useAuth: vi.fn() }));

const renderRoute = () =>
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route path="/login" element={<h1>Login page</h1>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/private" element={<h1>Private content</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      logout: vi.fn(),
    });
  });
  it('shows loading before deciding whether to redirect', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      logout: vi.fn(),
    });
    renderRoute();
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
  it('redirects unauthenticated users to login', () => {
    renderRoute();
    expect(screen.getByRole('heading', { name: 'Login page' })).toBeInTheDocument();
    expect(screen.queryByText('Private content')).not.toBeInTheDocument();
  });
  it('renders the nested page for authenticated users', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: 1, username: 'ivan', email: 'ivan@example.com' },
      isLoading: false,
      isAuthenticated: true,
      logout: vi.fn(),
    });
    renderRoute();
    expect(screen.getByRole('heading', { name: 'Private content' })).toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });
});
