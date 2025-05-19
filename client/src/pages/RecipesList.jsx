import { useEffect, useState } from 'react';
import { fetchRecipes } from '../api/recipes';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav/Nav.jsx';
import RecipesGrid from '../components/RecipesGrid/RecipesGrid.jsx';
import '../styles/recipesList.css';

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p role="alert">Error: {error}</p>;
  console.log('Fetched recipes:', recipes);
  return (
    <div>
      <Nav />
      {recipes.length === 0 ? (
        <p>Recipes Loading...</p>
      ) : (
        <>
          <h4 className="recipesCount">
            <b>{recipes.length} </b>
            Recipes
          </h4>
          <RecipesGrid recipes={recipes} />
        </>
      )}
    </div>
  );
}
