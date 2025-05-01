import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import App from '../App';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'pong' }),
    })
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('renders main app content', () => {
  render(<App />);
  const displayElement = screen.getByText('Backend says:'); // Adjust this based on your UI
  expect(displayElement).toBeInTheDocument();
});
