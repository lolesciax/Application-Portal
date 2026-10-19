import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
function renderRoute(value) {
  useAuth.mockReturnValue(value);
  return render(<MemoryRouter initialEntries={['/private']}><Routes>
    <Route path="/private" element={<ProtectedRoute role="engineer"><h1>Application workspace</h1></ProtectedRoute>} />
    <Route path="/login" element={<h1>Sign in</h1>} />
    <Route path="/admin-dashboard" element={<h1>Admin workspace</h1>} />
  </Routes></MemoryRouter>);
}
test('waits for session restoration instead of redirecting', () => {
  renderRoute({ loading: true, user: null });
  expect(screen.getByRole('status')).toHaveTextContent('Restoring your session');
  expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
});
test('requires a signed-in user', () => {
  renderRoute({ loading: false, user: null });
  expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
});
test('renders the authorized role', () => {
  renderRoute({ loading: false, user: { role: 'engineer' } });
  expect(screen.getByRole('heading', { name: 'Application workspace' })).toBeInTheDocument();
});
test('redirects a user with a different role', () => {
  renderRoute({ loading: false, user: { role: 'admin' } });
  expect(screen.getByRole('heading', { name: 'Admin workspace' })).toBeInTheDocument();
});
test('offers retry when the server is unavailable', () => {
  renderRoute({ loading: false, user: null, sessionError: 'Server unavailable', retrySession: jest.fn(), logout: jest.fn() });
  expect(screen.getByRole('alert')).toHaveTextContent('Server unavailable');
  expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
});
