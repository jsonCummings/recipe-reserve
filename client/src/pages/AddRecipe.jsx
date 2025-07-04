import React from 'react';
import { useNavigate } from 'react-router-dom';

import Nav from '../components/Nav/Nav.jsx';

import RecipeForm from '../components/RecipeForm/RecipeForm.jsx';

const AddRecipePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Nav />
      <section className="addRecipePage">
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
