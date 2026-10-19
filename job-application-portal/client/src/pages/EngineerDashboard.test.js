import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import EngineerDashboard from './EngineerDashboard';
import ApplicantOverviewPage from '../features/applicant/pages/ApplicantOverviewPage';
import ApplicantApplicationPage from '../features/applicant/pages/ApplicantApplicationPage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
jest.mock('../context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('axios', () => ({ get: jest.fn(), post: jest.fn() }));
const user = { role: 'engineer', firstName: 'Maria', lastName: 'Cruz', email: 'maria@example.test', phone: '09123456789' };
beforeEach(() => { jest.clearAllMocks(); useAuth.mockReturnValue({ user, logout: jest.fn() }); });
test('blocks saving when the existing application cannot be loaded and permits retry', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {});
  axios.get.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce({ data: { status: 'pending', personalInfo: user, resume: { originalName: 'resume.pdf' } } });
  renderWorkspace('/engineer-dashboard/application');
  expect(await screen.findByRole('alert')).toHaveTextContent('could not load');
  expect(screen.getByRole('button', { name: /submit application/i })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await waitFor(() => expect(screen.getByRole('button', { name: /save changes/i })).toBeEnabled());
  expect(screen.getAllByText('Pending Review').length).toBeGreaterThan(0);
  log.mockRestore();
});

function renderWorkspace(initial = '/engineer-dashboard') {
 return render(<MemoryRouter initialEntries={[initial]}><Routes><Route path="/engineer-dashboard" element={<EngineerDashboard />}><Route index element={<ApplicantOverviewPage />} /><Route path="application" element={<ApplicantApplicationPage />} /></Route></Routes></MemoryRouter>);
}

test('applicant dashboard and editor are separate modules that preserve draft changes', async () => {
 axios.get.mockResolvedValue({ data: { status: 'pending', personalInfo: user, resume: { originalName: 'resume.pdf' } } });
 renderWorkspace();
 expect(await screen.findByRole('heading', { name: 'Application status' })).toBeInTheDocument();
 expect(screen.queryByLabelText('First name *')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('link', { name: 'My application' }));
 expect(await screen.findByRole('heading', { name: 'My application' })).toBeInTheDocument();
 fireEvent.change(screen.getByLabelText('First name *'), { target: { value: 'Sophia' } });
 fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
 expect(screen.queryByLabelText('First name *')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('link', { name: 'My application' }));
 expect(screen.getByLabelText('First name *')).toHaveValue('Sophia');
 expect(axios.get).toHaveBeenCalledTimes(1);
});
