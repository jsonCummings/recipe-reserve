import React, { useState, useEffect } from 'react';
import { deleteRecipe } from '../../api/recipes';
import './recipeForm.css';

const defaultForm = {
  title: '',
  subtitle: '',
  author: '',
  url: '',
  image_url: '',
  details: [{ detail_key: '', detail_value: '' }],
  ingredients: [{ ingredient: '' }],
  instructions: [{ step_number: 1, instructions: '' }],
  notes: [{ note: '' }],
  tags: [''],
};

const RecipeForm = ({ recipe, onSuccess }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (recipe) {
      const mappedDetails = recipe.details?.length ? recipe.details : [{ '': '' }];
      setForm({
        ...recipe,
        details: mappedDetails,
        ingredients: recipe.ingredients?.length ? recipe.ingredients : [''],
        instructions: recipe.instructions?.length ? recipe.instructions : [''],
        notes: recipe.notes?.length ? recipe.notes : [],
        tags: recipe.tags?.length ? recipe.tags : [''],
      });
    }
  }, [recipe]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setForm((prev) => {
      const copy = [...prev[field]];
      copy[index] = value;
      return { ...prev, [field]: copy };
    });
  };

  const addField = (field, emptyValue) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], emptyValue],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!recipe?.id;
    const url = isEdit ? `/api/recipes/${recipe.id}` : '/api/recipes';
    const method = isEdit ? 'PUT' : 'POST';
    console.log('Submitting:', form, url, method);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert(isEdit ? 'Recipe updated!' : `Recipe added! ID: ${data.recipeId}`);
        if (!isEdit) setForm(defaultForm);
        onSuccess?.(data);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Submit failed', err);
      alert('Failed to submit recipe');
    }
  };
  console.log('Form:', form);

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{recipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
      <div className='fullWidth'>
        <label for={form.title}>Title</label>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div className='fullWidth'>
        <label for={form.subtitle}>Subtitle</label>
        <input
          placeholder="Subtitle"
          value={form.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
        />
      </div>
      <div className='fullWidth'>
        <label for={form.author}>Author</label>
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => handleChange('author', e.target.value)}
        />
      </div>
      <div className='fullWidth'>
        <label for={form.url}>URL</label>
        <input
          placeholder="URL"
          value={form.url}
          onChange={(e) => handleChange('url', e.target.value)}
        />
      </div>
      <div className='fullWidth'>
        <label for={form.image_url}>Image URL</label>
        <input
          placeholder="Image URL"
          value={form.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
        />
      </div>

      <h4>Details</h4>
      {form.details.map((detail, i) => (
        <div key={i} className="halfFlex">
          <div className='halfWidth'>
            <label for={detail.detail_key}>Label</label>
            <input
              placeholder="Label"
              value={detail.detail_key || ''}
              onChange={(e) =>
                handleArrayChange('details', i, {
                  ...detail,
                  detail_key: e.target.value,
                })
              }
            />
          </div>
          <div className='halfWidth'>
            <label for={detail.detail_value}>Value</label>
            <input
              placeholder="Value"
              value={detail.detail_value || ''}
              onChange={(e) =>
                handleArrayChange('details', i, {
                  ...detail,
                  detail_value: e.target.value,
                })
              }
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => addField('details', { detail_key: '', detail_value: '' })}
      >
        + Add Detail
      </button>

      <h4>Ingredients</h4>
      {form.ingredients.map((item, i) => (
        <div key={i} className='fullWidth'>
          <label for={item.ingredient}>Ingredient</label>
          <input
            placeholder={`Ingredient ${i + 1}`}
            value={item.ingredient || ''}
            onChange={(e) =>
              handleArrayChange('ingredients', i, {
                ...item,
                ingredient: e.target.value,
              })
            }
          />
        </div>
      ))}
      <button type="button" onClick={() => addField('ingredients', { ingredient: '' })}>
        + Add Ingredient
      </button>

      <h4>Instructions</h4>
      {form.instructions.map((step, i) => (
        <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="number"
            min="1"
            placeholder="Step #"
            value={step.step_number || i + 1}
            onChange={(e) =>
              handleArrayChange('instructions', i, {
                ...step,
                step_number: parseInt(e.target.value, 10),
              })
            }
            style={{ width: '60px' }}
          />
          <textarea
            placeholder={`Instruction ${i + 1}`}
            value={step.instruction || ''}
            onChange={(e) =>
              handleArrayChange('instructions', i, {
                ...step,
                instruction: e.target.value,
              })
            }
            style={{ flex: 1 }}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          addField('instructions', { step_number: form.instructions.length + 1, instructions: '' })
        }
      >
        + Add Instruction
      </button>

      <h4>Notes</h4>
      {form.notes.map((note, i) => (
        <div key={i} className='fullWidth'>
          <label for={note.note}>Ingredient</label>
          <input
            key={i}
            placeholder={`Note ${i + 1}`}
            value={note.note || ''}
            onChange={(e) =>
              handleArrayChange('notes', i, {
                ...note,
                note: e.target.value,
              })
            }
            minLength="3" 
            maxLength="10"
            size="10"
          />
        </div>
      ))}
      <button type="button" onClick={() => addField('notes', { note: '' })}>
        + Add Note
      </button>

      <h4>Tags</h4>
      {form.tags.map((tag, i) => (
        <div key={i} className='fullWidth'>
          <label for={tag}>Tag</label>
          <input
            key={i}
            placeholder={`Tag ${i + 1}`}
            value={tag}
            onChange={(e) => handleArrayChange('tags', i, e.target.value)}
            minLength="3" 
            maxLength="10"
            size="10"
          />
        </div>
      ))}
      <button type="button" onClick={() => addField('tags', '')}>
        + Add Tag
      </button>

      <div className='actionsContainer'> 
        <button type="submit">
          {recipe ? 'Update' : 'Submit'} Recipe
        </button>
        <button type="button" onClick={() => setForm(defaultForm)}>
          Reset
        </button>
        <button type="button" onClick={() => window.history.back()}>
          Cancel
        </button>
        <button type="button" onClick={() => deleteRecipe(recipe.id)}>
          Delete
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
