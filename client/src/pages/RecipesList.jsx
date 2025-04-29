import { useEffect, useState } from 'react';
import { fetchRecipes } from '../api/recipes';
import { Link } from 'react-router-dom';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <div>
      <h1>Recipes</h1>
      {recipes.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} data-testid="recipe-card">
              <h2>{recipe.title}</h2>
              <img src={recipe.image_url} alt={recipe.title} width={150} />
              <p>{recipe.details?.map((d) => Object.entries(d)[0].join(': ')).join(', ')}</p>
              <p>{recipe.tags?.join(', ')}</p>
              <Link to={`/recipes/${recipe.id}`}>View Full Recipe</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
