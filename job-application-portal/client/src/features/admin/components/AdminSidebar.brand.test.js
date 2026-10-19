import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const baseProps = {
  user: { firstName: 'Lawrence', lastName: 'Galve', email: 'contact@example.com' },
  logout: jest.fn(),
  onClose: jest.fn(),
  startResizing: jest.fn(),
  resizeFromKeyboard: jest.fn()
};

test.each([
  [false, 'Admin sections', 'Hiring workspace', '/admin-dashboard'],
  [true, 'Applicant sections', 'Applicant workspace', '/engineer-dashboard']
])('uses a one-line brand lockup for applicant=%s', (applicant, navLabel, subtitle, destination) => {
  const { container } = render(
    <MemoryRouter><AdminSidebar {...baseProps} applicant={applicant} /></MemoryRouter>
  );
  const brand = screen.getByRole('link', { name: 'Application Portal dashboard' });
  expect(brand).toHaveAttribute('href', destination);
  expect(brand.querySelector('.sidebar-brand-name')).toHaveTextContent(/^Application Portal$/);
  expect(brand.querySelector('.sidebar-brand-name').children).toHaveLength(0);
  expect(brand.querySelector('.sidebar-brand-subtitle')).toHaveTextContent(subtitle);
  expect(container.querySelectorAll('.sidebar-brand-subtitle')).toHaveLength(1);
  expect(screen.getByRole('navigation', { name: navLabel })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
});
