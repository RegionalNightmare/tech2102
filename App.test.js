import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the course heading', () => {
  render(<App />);
  const heading = screen.getByText(/TECH2102/i);
  expect(heading).toBeInTheDocument();
});

test('renders the group number', () => {
  render(<App />);
  const group = screen.getByText(/Group 2/i);
  expect(group).toBeInTheDocument();
});

test('renders team member name Tom', () => {
  render(<App />);
  const member = screen.getByText(/Tom/i);
  expect(member).toBeInTheDocument();
});

test('renders the team members list', () => {
  render(<App />);
  const list = screen.getByTestId('members-list');
  expect(list).toBeInTheDocument();
  expect(list.children.length).toBeGreaterThan(0);
});
