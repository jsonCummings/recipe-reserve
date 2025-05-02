import { useEffect, useState } from 'react';
import { fetchRecipes } from '../api/recipes';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
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
          <section className="recipesList">
            {recipes.map((recipe) => (
              <Link to={`/recipes/${recipe.id}`} className="recipeCard" key={recipe.id}>
                <img src={recipe.image_url} alt={recipe.title} />
                <div className="tagHolder">
                  {recipe.tags?.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="recipeTitle">{recipe.title}</span>
                <span className="recipeAuthor">{recipe.author}</span>
                {recipe.details?.map((d) => {
                  if (d.detail_key === 'Cook Time' || d.detail_key === 'Servings') {
                    return (
                      <span className="recipeDetails">
                        {d.detail_key}: {d.detail_value}
                      </span>
                    );
                  }
                })}
                <i className="rankingStars" data-star={`${recipe.rating}`}></i>
              </Link>
            ))}
          </section>
        </>
      )}
    </div>
  );
}
