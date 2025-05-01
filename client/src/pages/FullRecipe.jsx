import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchFullRecipe } from '../api/recipes';
import Nav from '../components/Nav';
import '../styles/fullRecipe.css';

export default function FullRecipe() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    console.log('Loading recipe with ID:', id)
    fetchFullRecipe(id)
      .then(data => setRecipe(data.recipe))
      .catch((err) => console.error('Error fetching recipe:', err))
  }, [id])
  
  if (!recipe) return <div>Loading…</div>;
  console.log('Fetched recipe:', recipe);

  const displayImg = recipe.image_url.slice(0,-1);
  console.log('displayImg', displayImg);

  return (
    <>
    <Nav />
    <section className='fullRecipe'>
      <section className="recipeHeader">
        <div className="recipeHeaderImage">
          <img src={displayImg} alt={recipe.title} className="heroImage" />
        </div>
        <h1>{recipe.title}</h1>
        <div className="things">
          {recipe.subtitle ? <span>{recipe.subtitle}</span> : null}
          <span>Author: {recipe.author}</span>
        </div>
        <h3>Details</h3>
        <div className="fullDetails">
          {(recipe.details || []).map((d, i) => (
            <span key={i} >
              {Object.entries(d).map(([k, v]) =>  `${v}`).join(': ')}
            </span>
            ))}
        </div>
      </section>
      <section className="recipeInformation">
        <section className='recipeIngredients'>
          <h2>Ingredients</h2>
          <ul>
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item.ingredient}</li>
            ))}
          </ul>
        </section>
        <section className='recipeInstructions'>
          <h2>Instructions</h2>
          <div className="instructions">
            {recipe.instructions.map((item, i) => (
              <>
                <h5> Step {i+1}: </h5>
                <p key={i}>{item.instruction}</p>
              </>
            ))}
          </div>
        </section>
      </section>
      <section className="recipeInformation">

        <section className='recipeTags'>
          <h4>Tags</h4>
          <ul>
            {recipe.tags.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>

        <section className='recipeNotes'>
          <h2>Notes</h2>
            {recipe.notes.map((item, i) => (
              <p key={i}>{item.note}</p>
            ))}
        </section>

      </section>
    </section>
  </>
  )
}
