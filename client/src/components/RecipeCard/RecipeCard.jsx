import { Link } from 'react-router-dom';
import './recipeCard.css';

export default function RecipeCard({ recipe }) {
  return (
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
      {recipe.details?.map((d, i) => {
        if (d.detail_key === 'Cook Time' || d.detail_key === 'Servings') {
          return (
            <span key={i} className="recipeDetails">
              {d.detail_key}: {d.detail_value}
            </span>
          );
        }
        return null;
      })}
      <i className="rankingStars" data-star={`${recipe.rating}`}></i>
    </Link>
  );
}
