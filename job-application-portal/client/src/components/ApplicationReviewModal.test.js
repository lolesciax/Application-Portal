import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApplicationReviewModal from './ApplicationReviewModal';
import axios from 'axios';
jest.mock('axios', () => ({ put: jest.fn(), defaults: { baseURL: 'http://localhost:5000/api' } }));
const application = { _id: 'fixture', status: 'pending', submittedAt: '2026-10-01', personalInfo: { firstName: 'Maria', lastName: 'Cruz', email: 'maria@example.test', phone: '09123456789' }, resume: { filename: 'resume.pdf', originalName: 'Resume.pdf' }, adminNotes: 'Existing note' };
let onClose, onSaved;
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});
beforeEach(() => {
  jest.clearAllMocks(); onClose = jest.fn(); onSaved = jest.fn();
  axios.put.mockResolvedValue({ data: {} });
});
const setup = () => render(<ApplicationReviewModal application={application} onClose={onClose} onSaved={onSaved} />);
test('opens on applicant overview with a resume link and accessible name', () => {
  setup();
  expect(screen.getByRole('dialog', { name: 'Review application' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('link', { name: /open resume/i })).toHaveAttribute('target', '_blank');
  expect(screen.getByText('Maria Cruz', { selector: 'strong' })).toBeInTheDocument();
});
test('supports keyboard section navigation and validates an incomplete interview', () => {
  setup(); fireEvent.keyDown(screen.getByRole('tab', { name: 'Overview' }), { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: 'Interview' })).toHaveAttribute('aria-selected', 'true');
  fireEvent.click(screen.getByRole('button', { name: 'Save interview' }));
  expect(screen.getByRole('alert')).toHaveTextContent('highlighted fields');
  expect(screen.getByLabelText(/interview date/i)).toHaveAttribute('aria-invalid', 'true');
  expect(axios.put).not.toHaveBeenCalled();
});
test('warns before discarding edits and lets the admin keep them', () => {
  setup(); fireEvent.click(screen.getByRole('tab', { name: 'Status & notes' }));
  fireEvent.change(screen.getByLabelText(/message to the applicant/i), { target: { value: 'Draft feedback' } });
  fireEvent.click(screen.getByRole('button', { name: 'Close application details' }));
  expect(screen.getByRole('alertdialog')).toHaveTextContent('not been saved');
  expect(screen.getByRole('button', { name: 'Keep editing' })).toHaveFocus();
  fireEvent.click(screen.getByRole('button', { name: 'Keep editing' }));
  expect(screen.getByLabelText(/message to the applicant/i)).toHaveValue('Draft feedback');
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: 'Close' }));
  fireEvent.click(screen.getByRole('button', { name: 'Discard changes' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});
test('requires a nonempty reason for rejection', () => {
  setup(); fireEvent.click(screen.getByRole('tab', { name: 'Status & notes' }));
  fireEvent.change(screen.getByLabelText(/application status/i), { target: { value: 'rejected' } });
  fireEvent.change(screen.getByLabelText(/message to the applicant/i), { target: { value: '   ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save status' }));
  expect(screen.getByLabelText(/message to the applicant/i)).toHaveAttribute('aria-invalid', 'true');
  expect(axios.put).not.toHaveBeenCalled();
});
test('submits cleared notes and disables dismissal while saving', async () => {
  let finish; axios.put.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  setup(); fireEvent.click(screen.getByRole('tab', { name: 'Status & notes' }));
  fireEvent.change(screen.getByLabelText(/message to the applicant/i), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save status' }));
  expect(axios.put).toHaveBeenCalledWith('/admin/applications/fixture/status', { status: 'pending', adminNotes: '' });
  expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
  finish({ data: {} });
  await waitFor(() => expect(onSaved).toHaveBeenCalledWith('Application status updated.'));
});
test('preserves entered data and provides retry feedback on an API failure', async () => {
  axios.put.mockRejectedValue({ response: { data: { msg: 'Please retry later.' } } });
  setup(); fireEvent.click(screen.getByRole('tab', { name: 'Status & notes' }));
  fireEvent.change(screen.getByLabelText(/message to the applicant/i), { target: { value: 'Keep this feedback' } });
  fireEvent.click(screen.getByRole('button', { name: 'Save status' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Please retry later');
  expect(screen.getByLabelText(/message to the applicant/i)).toHaveValue('Keep this feedback');
  expect(screen.getByRole('button', { name: 'Save status' })).toBeEnabled();
  expect(onSaved).not.toHaveBeenCalled();
});
