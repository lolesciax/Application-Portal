import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EngineerDashboard from './EngineerDashboard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn() }));
const applicant = { role: 'engineer', firstName: 'Test', lastName: 'Applicant', email: 'applicant@example.test', phone: '09123456789' };

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: applicant, logout: jest.fn() });
  axios.get.mockRejectedValue({ response: { status: 404 } });
});

async function setup(initialPath = '/engineer-dashboard') {
  render(<MemoryRouter initialEntries={[initialPath]}>
    <Routes>
      <Route path="/engineer-dashboard" element={<EngineerDashboard />}>
        <Route index element={<h1>Overview screen</h1>} />
        <Route path="application" element={<h1>Application editor screen</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>);
  await screen.findByRole('navigation', { name: 'Applicant sections' });
}

test('applicant sidebar shows two correct destinations and an active module', async () => {
  await setup();
  const overview = screen.getByRole('link', { name: 'Dashboard' });
  const application = screen.getByRole('link', { name: 'My application' });
  expect(overview).toHaveAttribute('href', '/engineer-dashboard');
  expect(application).toHaveAttribute('href', '/engineer-dashboard/application');
  expect(overview).toHaveClass('active');
  fireEvent.click(application);
  expect(await screen.findByRole('heading', { name: 'Application editor screen' })).toBeInTheDocument();
  expect(application).toHaveClass('active');
});

test('mobile menu closes when a link is used', async () => {
  await setup();
  fireEvent.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('link', { name: 'My application' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false'));
});

test('applicant sidebar can be resized from keyboard and remembers the width', async () => {
  await setup();
  const separator = screen.getByRole('separator', { name: 'Resize navigation sidebar' });
  expect(separator).toHaveAttribute('aria-valuenow', '264');
  fireEvent.keyDown(separator, { key: 'ArrowRight' });
  expect(separator).toHaveAttribute('aria-valuenow', '280');
  await waitFor(() => expect(window.localStorage.getItem('application-portal-applicant-sidebar-width-v4')).toBe('280'));
  fireEvent.keyDown(separator, { key: 'End' });
  expect(separator).toHaveAttribute('aria-valuenow', '336');
});
