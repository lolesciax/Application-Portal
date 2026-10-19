import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
test('admin login uses the backend instead of creating a fake token', async () => {
  const login = jest.fn().mockResolvedValue({ success: false, error: 'Invalid credentials' });
  useAuth.mockReturnValue({ user: null, login });
  localStorage.clear();
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Username or email'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  await waitFor(() => expect(login).toHaveBeenCalledWith('admin', 'admin123'));
  expect(localStorage.getItem('token')).toBeNull();
  expect(await screen.findByRole('alert')).toHaveTextContent('4 attempts remaining');
});


test.each(['', 'bad@email', 'invalid user', 'ab'])('blocks invalid login identifier %s', username => {
  const login = jest.fn(); useAuth.mockReturnValue({ user: null, login, loading: false });
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Username or email'), { target: { value: username } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Example123' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByLabelText('Username or email')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('Username or email')).toHaveFocus();
  expect(login).not.toHaveBeenCalled();
});

test('requires a nonblank password without applying signup password rules to existing users', () => {
  const login = jest.fn(); useAuth.mockReturnValue({ user: null, login, loading: false });
  render(<MemoryRouter><Login /></MemoryRouter>);
  fireEvent.change(screen.getByLabelText('Username or email'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
  expect(screen.getByText('Enter your password.')).toBeInTheDocument();
  expect(login).not.toHaveBeenCalled();
});
