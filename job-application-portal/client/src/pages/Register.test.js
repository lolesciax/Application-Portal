import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn() }));
const fill = (label, value) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const register = jest.fn();
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: null, loading: false, register });
  axios.get.mockResolvedValue({ data: { exists: false } });
});
function setupProfile() {
  render(<MemoryRouter><Register /></MemoryRouter>);
  fill('First name', 'Maria'); fill('Last name', 'Dela Cruz');
  fill('Email address', 'maria@example.test'); fill('Phone number', '09123456789');
  fireEvent.click(screen.getByRole('button', { name: /continue to account/i }));
}
test('validates the first step and focuses the first invalid field', () => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: /continue to account/i }));
  expect(screen.getByRole('alert')).toHaveTextContent('highlighted fields');
  expect(screen.getByLabelText('First name')).toHaveAttribute('aria-invalid', 'true');
  expect(register).not.toHaveBeenCalled();
});
test('preserves profile details when navigating between signup steps', () => {
  setupProfile();
  expect(screen.getByRole('heading', { name: 'Now, make it yours.' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Back' }));
  expect(screen.getByLabelText('Email address')).toHaveValue('maria@example.test');
});
test('submits a normalized profile without sending the confirmation password', async () => {
  register.mockResolvedValue({ success: true }); setupProfile();
  fill('Username', 'Maria_123'); fill('Password', 'Example123'); fill('Confirm password', 'Example123');
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  await waitFor(() => expect(register).toHaveBeenCalledWith(expect.objectContaining({ username: 'maria_123', firstName: 'Maria', email: 'maria@example.test', password: 'Example123' })));
  expect(register.mock.calls[0][0]).not.toHaveProperty('confirmPassword');
});
test('blocks mismatched passwords before requesting registration', () => {
  setupProfile(); fill('Username', 'maria123'); fill('Password', 'Example123'); fill('Confirm password', 'Different123');
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  expect(screen.getByText('Your passwords do not match.')).toBeInTheDocument();
  expect(register).not.toHaveBeenCalled();
});


test.each(['0912345678', '091234567890', '09123abc789'])('blocks invalid phone number %s before the account step', phone => {
  render(<MemoryRouter><Register /></MemoryRouter>);
  fill('First name', 'Maria'); fill('Last name', 'Cruz'); fill('Email address', 'maria@example.test'); fill('Phone number', phone);
  fireEvent.click(screen.getByRole('button', { name: /continue to account/i }));
  expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Enter exactly 11 digits without spaces or punctuation.')).toBeInTheDocument();
  expect(register).not.toHaveBeenCalled();
});

test('shows server validation errors on the correct signup step', async () => {
  register.mockResolvedValue({ success: false, error: 'Invalid phone', errors: { phone: 'Enter exactly 11 digits.' } });
  setupProfile(); fill('Username', 'maria123'); fill('Password', 'Example123'); fill('Confirm password', 'Example123');
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  expect(await screen.findByText('Enter exactly 11 digits.')).toBeInTheDocument();
  expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true');
});


test('changing an email cancels its stale availability request', async () => {
  let resolveFirst;
  axios.get.mockImplementationOnce(() => new Promise(resolve => { resolveFirst = resolve; }));
  render(<MemoryRouter><Register /></MemoryRouter>);
  fill('Email address', 'first@example.test');
  fireEvent.blur(screen.getByLabelText('Email address'));
  expect(screen.getByText('Checking availability...')).toBeInTheDocument();
  const signal = axios.get.mock.calls[0][1].signal;
  fill('Email address', 'second@example.test');
  expect(signal.aborted).toBe(true);
  await act(async () => { resolveFirst({ data: { exists: true } }); });
  expect(screen.queryByText('Already registered. Please try another.')).not.toBeInTheDocument();
  fireEvent.blur(screen.getByLabelText('Email address'));
  expect(await screen.findByText('Available to use.')).toBeInTheDocument();
});
