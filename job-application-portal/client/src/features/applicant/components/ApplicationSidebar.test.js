import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApplicationSidebar from './ApplicationSidebar';

const baseline = {
  contactReady: true,
  complete: 5,
  resumeFile: null,
  stage: 'Pending Review',
  steps: ['Submitted', 'In review', 'Interview', 'Decision'],
  application: {
    status: 'pending',
    resume: { originalName: 'resume.pdf' }
  }
};

function setup(overrides = {}) {
  return render(<MemoryRouter><ApplicationSidebar {...baseline} {...overrides} /></MemoryRouter>);
}

test('renders a coherent progress dashboard and the current hiring step', () => {
  const { container } = setup();
  expect(screen.getByRole('heading', { name: 'Application status' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Application readiness' })).toBeInTheDocument();
  expect(screen.getByRole('progressbar', { name: 'Application readiness' })).toHaveValue(5);
  const steps = container.querySelectorAll('.application-timeline li');
  expect(steps).toHaveLength(4);
  expect(steps[1]).toHaveAttribute('aria-current', 'step');
  expect(steps[3]).not.toHaveClass('reached');
});

test('does not mark imported or unknown statuses as a final hiring decision', () => {
  const { container } = setup({
    application: { status: 'imported' },
    stage: 'Imported',
    complete: 3
  });
  const steps = container.querySelectorAll('.application-timeline li');
  expect(steps[0]).toHaveAttribute('aria-current', 'step');
  expect(steps[3]).not.toHaveClass('reached');
  expect(screen.getByRole('progressbar')).toHaveValue(3);
});

test('shows interview details only when a valid date is recorded', () => {
  setup({ application: {
    status: 'interview_scheduled',
    resume: { originalName: 'resume.pdf' },
    interviewSchedule: {
      date: '2026-11-06T10:00:00', time: '10:00 AM', location: 'Main office'
    }
  }, stage: 'Interview Scheduled' });
  const card = screen.getByRole('heading', { name: 'Your interview' }).closest('section');
  expect(within(card).getByText('10:00 AM')).toBeInTheDocument();
  expect(within(card).getByText('Main office')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'What happens next?' })).not.toBeInTheDocument();
});
