import RecipeCard from '../RecipeCard/RecipeCard.jsx';
import './recipesGrid.css';

export default function RecipesGrid({ recipes }) {
  return (
    <section className="recipesList">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </section>
  );
}