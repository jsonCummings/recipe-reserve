export const fetchRecipes = async () => {
  const res = await fetch('/api/recipes');
  if (!res.ok) throw new Error('Failed to fetch recipes');
  return res.json();
};

export async function fetchFullRecipe(id) {
  // Use id for the query
  const res = await fetch(`/api/recipes/${id}`);
  return res.json();
}

export async function addRecipe(recipeData) {
  const res = await fetch('/api/recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData),
  });

  if (!res.ok) throw new Error('Failed to add recipe');
  return res.json();
}

export async function editRecipe(id, recipeData) {
  const res = await fetch(`/api/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipeData),
  });

  if (!res.ok) throw new Error('Failed to update recipe');
  return res.json();
}

export async function deleteRecipe(id) {
  // add a confirmation dialog and move back to the recipe list after confirmed delete

  console.log('Deleting recipe with ID:', id);
  const res = await fetch(`/api/recipes/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Failed to delete recipe');
  return res.json();
}

// bulk adding recipes
// searching for recipes
// tag filtering
