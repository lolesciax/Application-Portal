import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminOverviewPage from '../features/admin/pages/AdminOverviewPage';
import AdminApplicationsPage from '../features/admin/pages/AdminApplicationsPage';
import AdminPipelinePage from '../features/admin/pages/AdminPipelinePage';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn()
}));
jest.mock('axios', () => ({
  get: jest.fn()
}));
jest.mock('../components/ApplicationReviewModal', () => ({
  application,
  onClose
}) => <div role="dialog" aria-label="Application review">
  {application.personalInfo.email}
  <button onClick={onClose}>Close review</button>
</div>);
const applications = Array.from({
  length: 9
}, (_, index) => ({
  _id: String(index + 1),
  status: index % 2 ? 'hired' : 'pending',
  personalInfo: {
    firstName: 'Applicant',
    lastName: String(index + 1),
    email: 'applicant' + (index + 1) + '@example.test',
    position: 'Engineer'
  },
  submittedAt: '2026-10-' + String(index + 1).padStart(2, '0')
}));
beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({
    user: {
      role: 'admin',
      firstName: 'Hiring',
      lastName: 'Admin'
    },
    logout: jest.fn()
  });
  axios.get.mockResolvedValue({
    data: applications
  });
  Element.prototype.scrollIntoView = jest.fn();
});
const setup = async (initial = '/admin-dashboard') => {
 render(<MemoryRouter initialEntries={[initial]}><Routes><Route path="/admin-dashboard" element={<AdminDashboard />}><Route index element={<AdminOverviewPage />} /><Route path="applications" element={<AdminApplicationsPage />} /><Route path="pipeline" element={<AdminPipelinePage />} /></Route></Routes></MemoryRouter>);
 await screen.findByRole('navigation', { name: 'Admin sections' });
};
test('summary filtering, search, and clearing filters operate on the same review queue', async () => {
  await setup();
  fireEvent.click(screen.getAllByRole('button', {
    name: 'View applications'
  })[1]);
  expect(screen.getByLabelText('Status:')).toHaveValue('pending');
  expect(screen.getAllByRole('button', {
    name: /^Review Applicant/
  })).toHaveLength(5);
  fireEvent.change(screen.getByLabelText('Search:'), {
    target: {
      value: 'unknown applicant'
    }
  });
  expect(screen.getByRole('heading', {
    name: 'No matching applications'
  })).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', {
    name: 'Clear filters'
  }).at(-1));
  expect(screen.getByLabelText('Status:')).toHaveValue('all');
  expect(screen.getAllByRole('button', {
    name: /^Review Applicant/
  })).toHaveLength(8);
});
test('pagination and selecting an application preserve the correct applicant record', async () => {
  await setup('/admin-dashboard/applications');
  fireEvent.click(screen.getByRole('button', {
    name: 'Next'
  }));
  expect(screen.getAllByRole('button', {
    name: /^Review Applicant/
  })).toHaveLength(1);
  fireEvent.click(screen.getByRole('button', {
    name: 'Review Applicant 1'
  }));
  expect(screen.getByRole('dialog', {
    name: 'Application review'
  })).toHaveTextContent('applicant1@example.test');
  fireEvent.click(screen.getByRole('button', {
    name: 'Close review'
  }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});


test('dashboard, applications, and pipeline are separate navigable screens', async () => {
 await setup();
 expect(screen.getByRole('heading', { name: 'Hiring overview' })).toBeInTheDocument();
 expect(screen.getByRole('heading', { name: 'Needs your attention' })).toBeInTheDocument();
 expect(screen.queryByRole('heading', { name: 'Hiring stages' })).not.toBeInTheDocument();
 expect(screen.queryByLabelText('Search:')).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('link', { name: /Applications Review applicant records/ }));
 expect(await screen.findByRole('heading', { name: 'Applications' })).toBeInTheDocument();
 expect(screen.queryByRole('heading', { name: 'Hiring overview' })).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole('link', { name: /Pipeline Status and interviews/ }));
 expect(await screen.findByRole('heading', { name: 'Pipeline & interviews' })).toBeInTheDocument();
 expect(screen.getByRole('heading', { name: 'Hiring stages' })).toBeInTheDocument();
 expect(screen.getByRole('heading', { name: 'Interview agenda' })).toBeInTheDocument();
 expect(screen.queryByRole('heading', { name: 'Needs your attention' })).not.toBeInTheDocument();
 expect(screen.queryByLabelText('Search:')).not.toBeInTheDocument();
});

test('an applications deep link restores its status filter', async () => {
 await setup('/admin-dashboard/applications?status=pending');
 expect(screen.getByLabelText('Status:')).toHaveValue('pending');
 expect(screen.getAllByRole('button', { name: /^Review Applicant/ })).toHaveLength(5);
});
