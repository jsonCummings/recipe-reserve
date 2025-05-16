import React from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../components/Nav';

import RecipeForm from '../components/RecipeForm/RecipeForm.jsx';

const AddRecipePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <section className="addPecipePage">
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
