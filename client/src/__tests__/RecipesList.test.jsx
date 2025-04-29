import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RecipesList from '../pages/RecipesList';
import * as api from '../api/recipes';
import { vi } from 'vitest';

const mockRecipes = [
  {
    id: 1,
    title: 'Quick Chicken Pozole',
    image_url: 'https://example.com/image.jpg',
    details: [{ CookTime: '40 minutes' }],
    tags: ['Soup', 'Mexican']
  },
];

vi.mock('../api/recipes', () => ({
  fetchRecipes: vi.fn(),
}));

test('renders recipe list from API', async () => {
  api.fetchRecipes.mockResolvedValue(mockRecipes);

  render(
    <MemoryRouter>
      <RecipesList />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText('Quick Chicken Pozole')).toBeInTheDocument();
    expect(screen.getByText(/Soup, Mexican/)).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /Quick Chicken Pozole/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view full recipe/i })).toBeInTheDocument();
  });
});
