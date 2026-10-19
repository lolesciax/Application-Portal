import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn() }));

beforeEach(() => {
  window.localStorage.clear();
  jest.clearAllMocks();
  useAuth.mockReturnValue({ user: { role: 'admin', firstName: 'Hiring', lastName: 'Admin' }, logout: jest.fn() });
  axios.get.mockResolvedValue({ data: [] });
});

async function setup() {
  render(<MemoryRouter initialEntries={['/admin-dashboard']}>
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />}>
        <Route index element={<h1>Overview content</h1>} />
        <Route path="applications" element={<h1>Applications content</h1>} />
      </Route>
    </Routes>
  </MemoryRouter>);
  await screen.findByRole('navigation', { name: 'Admin sections' });
}

test('opens the mobile drawer and closes it when navigating', async () => {
  await setup();
  const toggle = screen.getByRole('button', { name: 'Open navigation menu' });
  fireEvent.click(toggle);
  expect(screen.getByRole('button', { name: 'Close navigation menu' })).toHaveAttribute('aria-expanded', 'true');
  fireEvent.click(screen.getByRole('link', { name: /Applications Review applicant records/ }));
  expect(await screen.findByRole('heading', { name: 'Applications content' })).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Open navigation menu' })).toHaveAttribute('aria-expanded', 'false'));
});

test('resizes the desktop sidebar from the keyboard and persists a bounded width', async () => {
  await setup();
  const separator = screen.getByRole('separator', { name: 'Resize navigation sidebar' });
  expect(separator).toHaveAttribute('aria-valuenow', '264');
  fireEvent.keyDown(separator, { key: 'ArrowRight' });
  expect(separator).toHaveAttribute('aria-valuenow', '280');
  await waitFor(() => expect(window.localStorage.getItem('application-portal-admin-sidebar-width-v3')).toBe('280'));
  fireEvent.keyDown(separator, { key: 'End' });
  expect(separator).toHaveAttribute('aria-valuenow', '336');
  fireEvent.keyDown(separator, { key: 'ArrowRight' });
  expect(separator).toHaveAttribute('aria-valuenow', '336');
});

test('sidebar links use correct destinations and report the active one', async () => {
  await setup();
  expect(screen.getByRole('link', { name: /Dashboard Hiring overview/ })).toHaveAttribute('href', '/admin-dashboard');
  expect(screen.getByRole('link', { name: /Pipeline Status and interviews/ })).toHaveAttribute('href', '/admin-dashboard/pipeline');
  expect(screen.getByRole('link', { name: /Dashboard Hiring overview/ })).toHaveClass('active');
});


test('a narrow sidebar width saved by an older version is safely expanded', async () => {
  window.localStorage.setItem('application-portal-admin-sidebar-width-v3', '212');
  await setup();
  expect(screen.getByRole('separator', { name: 'Resize navigation sidebar' }))
    .toHaveAttribute('aria-valuenow', '244');
});
