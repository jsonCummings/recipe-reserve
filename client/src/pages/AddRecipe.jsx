import React from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../components/Nav';

import RecipeForm from '../components/RecipeForm';

const AddRecipePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <section className="addPecipePage">
        <h1>Add a New Recipe</h1>
        <RecipeForm
          onSuccess={(res) => {
            const newId = res.recipeId;
            if (newId) {
              navigate(`/recipes/${newId}`);
            } else {
              navigate('/recipes');
            }
          }}
        />
      </section>
    </>
  );
};

export default AddRecipePage;
