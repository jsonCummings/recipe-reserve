import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Nav from '../components/Nav/Nav.jsx';
import RecipeForm from '../components/RecipeForm/RecipeForm.jsx';

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch recipe');
        }

        setRecipe(data.recipe);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading recipe...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Nav />
      <div className="editRecipePage">
        <RecipeForm recipe={recipe} onSuccess={() => navigate(`/recipes/${id}`)} />
      </div>
    </>
  );
};

export default EditRecipePage;
