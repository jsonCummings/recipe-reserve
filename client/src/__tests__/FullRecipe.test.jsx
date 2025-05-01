import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import FullRecipe from '../pages/FullRecipe';
import * as api from '../api/recipes';
import { vi } from 'vitest';

const mockRecipe = {
  recipe: {
    id: 1,
    title: 'Quick Chicken Pozole',
    image_url:
      'https://images.food52.com/XkfGH05EREoMrMQaIEZqTVbl9ds=/375x250/53423e00-6d96-4bdf-831e-4708131726ec--pozole.JPG,',
    details: [
      {
        detail_key: 'Cook time',
        detail_value: '40 minutes',
      },
    ],
    ingredients: [
      {
        ingredient: '2 tablespoons olive oil',
      },
    ],
    instructions: [
      {
        step_number: 1,
        instruction:
          "Heat the oil over medium-high heat in large pot. Season the chicken with the cumin, chile powder, and salt and pepper. Brown each side of seasoned chicken (about 4 to 5 minutes per side), then remove chicken and set aside on a plate. Don't clean the pan just yet.",
      },
    ],
    notes: [
      {
        note: "Pozole contains hominy, a type of dried corn. It is usually made with pork, but I did a chicken version with some local, free-range chicken thighs. The broth has a bit of heat, and you can add toppings to your liking. It's delicious and healthy, while still filling enough to forget it's low in fat and calories. I could eat soup for every meal I think and this one is a crowd pleaser, unless someone in your crowd has a severe aversion to chiles…..this one packs a bit of heat. —Alexandra V. Jones",
      },
      {
        note: 'Why have I never tried hominy? It is great! And as a whole, this pozole made my week -- with the amount of chiles and smoky chipotle added, it had a comforting warmth instead of a prominent heat. I already have plans to make this recipe for a group since it is so versatile and conducive to personalization. I went for the avocado, lime, and sour cream, while my boyfriend added more adobo sauce and tortilla chips. —EmilyS1220',
      },
    ],
    tags: ['Mexican', 'Soup'],
  },
};

vi.mock('../api/recipes', () => ({
  fetchFullRecipe: vi.fn(),
}));

test('renders full recipe from API', async () => {
  api.fetchFullRecipe.mockResolvedValue(mockRecipe);

  render(
    <MemoryRouter initialEntries={['/recipes/1']}>
      <Routes>
        <Route path="/recipes/:id" element={<FullRecipe />} />
      </Routes>
    </MemoryRouter>
  );

  const heading = await screen.findByRole('heading', { level: 1 });
  expect(heading).toHaveTextContent('Quick Chicken Pozole');
});
