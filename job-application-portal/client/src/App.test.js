import { render, screen } from '@testing-library/react';
import App from './App';
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => ({ user: null, loading: false }),
}));
test('renders the application landing page with registration and login links', () => {
  window.history.replaceState({}, '', '/');
  render(<App />);
  expect(screen.getByRole('heading', { name: /your next opportunity/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /start your application/i })).toHaveAttribute('href', '/register');
});
