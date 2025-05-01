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
