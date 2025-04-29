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

    // Query for the main recipe details
    const [recipeRows] = await pool.query(`
      SELECT id, title, image_url, subtitle, author, url
      FROM recipes
      WHERE id = ?
    `, [recipeId]);

    if (recipeRows.length === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const recipe = recipeRows[0];

    // Query for recipe details
    const [details] = await pool.query(`
      SELECT detail_key, detail_value
      FROM recipe_details
      WHERE recipe_id = ?
    `, [recipeId]);

    // Query for ingredients
    const [ingredients] = await pool.query(`
      SELECT ingredient
      FROM ingredients
      WHERE recipe_id = ?
    `, [recipeId]);

    // Query for instructions
    const [instructions] = await pool.query(`
      SELECT step_number, instruction
      FROM instructions
      WHERE recipe_id = ?
      ORDER BY step_number ASC
    `, [recipeId]);

    // Query for notes
    const [notes] = await pool.query(`
      SELECT note
      FROM notes
      WHERE recipe_id = ?
    `, [recipeId]);

    // Query for tags
    const [tags] = await pool.query(`
      SELECT tags.name
      FROM recipe_tags
      JOIN tags ON recipe_tags.tag_id = tags.id
      WHERE recipe_tags.recipe_id = ?
    `, [recipeId]);
    
    res.json({
      recipe: {
        ...recipe,
        details,
        ingredients,
        instructions,
        notes,
        tags: tags.map(tag => tag.name),
      },
    });
  } catch (err) {
    console.error('Error retrieving recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
