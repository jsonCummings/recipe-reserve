import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running!');
});

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);

// GET all recipes (summary only)
app.get('/api/recipes', async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT id, title, image_url FROM recipes`);

    // Parse JSON fields (details and tags)
    const parsedRows = rows.map(recipe => ({
      ...recipe,
      // details: JSON.parse(recipe.details),
      // tags: JSON.parse(recipe.tags),
    }));

    res.json(parsedRows);
  } catch (err) {
    console.error('Error retrieving recipes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET a full recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipeId = req.params.id;

    const [rows] = await pool.query(`
      SELECT *
      FROM recipes
      WHERE id = ?
    `, [recipeId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = rows[0];

    // Parse JSON fields
    const parsedRecipe = {
      ...recipe,
      // details: JSON.parse(recipe.recipe_details),
      // ingredients: JSON.parse(recipe.ingredients),
      // instructions: JSON.parse(recipe.instructions),
      // notes: JSON.parse(recipe.notes),
      // tags: JSON.parse(recipe.tags),
      // tags2: JSON.parse(recipe.recipe_tags),
    };

    res.json(parsedRecipe);
  } catch (err) {
    console.error('Error retrieving recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
