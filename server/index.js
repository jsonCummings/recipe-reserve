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
const tempTags = ['Vegetarian', 'Under 30 Minutes', 'Bring to Friends'];
const tempDetails = [
  { detail_key: 'Prep Time', detail_value: '15 minutes' },
  { detail_key: 'Cook Time', detail_value: '30 minutes' },
  { detail_key: 'Servings', detail_value: '4 servings' },
];

app.get('/api/recipes', async (req, res) => {
  try {
    // const [rows] = await pool.query(`SELECT id, title, author, url, image_url FROM recipes`);
    // console.log('Retrieved recipes:', rows);
    const [rows] = await pool.query(`SELECT id, title, author, image_url FROM recipes`);

    // Parse JSON fields (details and tags)
    const parsedRows = rows.map(recipe => ({
      ...recipe,
      details: tempDetails,
      tags: tempTags,
      rating: Math.floor(Math.random() * 5) + 1, // Random rating between 1 and 5
    }));
  console.log('Parsed recipes:', parsedRows);
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

// PUT a full recipe by ID
app.put('/api/recipes/:id', async (req, res) => {
  console.log('Editing recipe:', req.params.id, req.body);
  try {
    const recipeId = req.params.id;
    const recipeData = req.body;
    const { title, image_url, subtitle, author, url, details, ingredients, instructions, notes, tags } = recipeData;

    // do the sql dance
    // recipes - recipe_id, title, image_url, subtitle, author, url
    // recipe_details - recipe_id, detail_key, detail_value
    // ingredients - recipe_id, ingredient
    // instructions - recipe_id, step_number, instruction
    // notes - recipe_id, note
    // recipe_tags - recipe_id, tag_id
    // tags - id, name

    // 1. Update the recipe in the recipes table
    await pool.query(`
      UPDATE recipes
      SET title = ?, image_url = ?, subtitle = ?, author = ?, url = ?
      WHERE id = ?
    `, [title, image_url, subtitle, author, url, recipeId]);
    // 2. Update the recipe details in the recipe_details table
    await pool.query(`
      DELETE FROM recipe_details WHERE recipe_id = ?
    `, [recipeId]);
    for (const detail of details) {
      const [key, value] = Object.entries(detail)[0];
      await pool.query(`
        INSERT INTO recipe_details (recipe_id, detail_key, detail_value)
        VALUES (?, ?, ?)
      `, [recipeId, key, value]);
    }

    // 3. Update the ingredients in the ingredients table
    await pool.query(`
      DELETE FROM ingredients WHERE recipe_id = ?
    `, [recipeId]);
    for (const { ingredient } of ingredients) {
      await pool.query(`INSERT INTO ingredients (recipe_id, ingredient) VALUES (?, ?)`, [recipeId, ingredient]);
    }


    // 4. Update the instructions in the instructions table
    await pool.query(`
      DELETE FROM instructions WHERE recipe_id = ?
    `, [recipeId]);
    for (const { step_number, instruction } of instructions) {
      await pool.query(`
        INSERT INTO instructions (recipe_id, step_number, instruction)
        VALUES (?, ?, ?)
      `, [recipeId, step_number, instruction]);
    }

    // 5. Update the notes in the notes table
    await pool.query(`
      DELETE FROM notes WHERE recipe_id = ?
    `, [recipeId]);
    for (const { note } of notes) {
      await pool.query(`INSERT INTO notes (recipe_id, note) VALUES (?, ?)`, [recipeId, note]);
    }

    // 6. Update the tags in the recipe_tags table
    await pool.query(`
      DELETE FROM recipe_tags WHERE recipe_id = ?
    `, [recipeId]);
    for (const tag of tags) {
      const [tagRows] = await pool.query(`
        SELECT id FROM tags WHERE name = ?
      `, [tag]);
      if (tagRows.length > 0) {
        const tagId = tagRows[0].id;
        await pool.query(`
          INSERT INTO recipe_tags (recipe_id, tag_id)
          VALUES (?, ?)
        `, [recipeId, tagId]);
      }
    }

    // 7. Return the updated recipe
    const [updatedRecipeRows] = await pool.query(`
      SELECT id, title, image_url, subtitle, author, url
      FROM recipes
      WHERE id = ?
    `, [recipeId]);
    const updatedRecipe = updatedRecipeRows[0];
    updatedRecipe.details = details;
    updatedRecipe.ingredients = ingredients;
    updatedRecipe.instructions = instructions;
    updatedRecipe.notes = notes;
    updatedRecipe.tags = tags;

    res.json({ message: 'Recipe updated', updatedRecipe });

  } catch (err) {
    console.error('Error editing recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST a new recipe
app.post('/api/recipes', async (req, res) => {
  const {
    title,
    image_url,
    subtitle,
    author,
    url,
    details = [],
    ingredients = [],
    instructions = [],
    notes = [],
    tags = [],
  } = req.body;

  // const recipeId = result.insertId;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Insert into recipes
    const [result] = await conn.query(`
      INSERT INTO recipes (title, image_url, subtitle, author, url)
      VALUES (?, ?, ?, ?, ?)
    `, [title, image_url, subtitle, author, url]);

    const recipeId = result.insertId; // Get the inserted recipe's ID


    // 2. Insert into recipe_details
    for (const detail of details) {
      const [key, value] = Object.entries(detail)[0];
      await conn.query(`
        INSERT INTO recipe_details (recipe_id, detail_key, detail_value)
        VALUES (?, ?, ?)
      `, [recipeId, key, value]);
    }

    // 3. Insert into ingredients
    for (const { ingredient } of ingredients) {
      await conn.query(`
        INSERT INTO ingredients (recipe_id, ingredient)
        VALUES (?, ?)
      `, [recipeId, ingredient]);
    }

    // 4. Insert into instructions
    for (const { step_number, instruction } of instructions) {
      await conn.query(`
        INSERT INTO instructions (recipe_id, step_number, instruction)
        VALUES (?, ?, ?)
      `, [recipeId, step_number, instruction]);
    }

    // 5. Insert into notes
    for (const { note } of notes) {
      await conn.query(`
        INSERT INTO notes (recipe_id, note)
        VALUES (?, ?)
      `, [recipeId, note]);
    }

    // 6. Insert tags and link via recipe_tags
    for (const tag of tags) {
      const [tagRows] = await conn.query(`SELECT id FROM tags WHERE name = ?`, [tag]);
      if (tagRows.length > 0) {
        const tagId = tagRows[0].id;
        await conn.query(`
          INSERT INTO recipe_tags (recipe_id, tag_id)
          VALUES (?, ?)
        `, [recipeId, tagId]);
      }
    }

    await conn.commit();

    res.status(201).json({ message: 'Recipe added', recipeId });
  } catch (err) {
    await conn.rollback();
    console.error('Error adding recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release();
  }
});

// DELETE a recipe by ID
app.delete('/api/recipes/:id', async (req, res) => {
  const { id } = req.params; // Get the recipe ID from the URL parameters

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1. Delete related data from recipe_details table
    await conn.query('DELETE FROM recipe_details WHERE recipe_id = ?', [id]);

    // 2. Delete related data from ingredients table
    await conn.query('DELETE FROM ingredients WHERE recipe_id = ?', [id]);

    // 3. Delete related data from instructions table
    await conn.query('DELETE FROM instructions WHERE recipe_id = ?', [id]);

    // 4. Delete related data from notes table
    await conn.query('DELETE FROM notes WHERE recipe_id = ?', [id]);

    // 5. Delete related data from recipe_tags table
    await conn.query('DELETE FROM recipe_tags WHERE recipe_id = ?', [id]);

    // 6. Finally, delete the recipe itself
    const [result] = await conn.query('DELETE FROM recipes WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await conn.commit(); // Commit the transaction

    res.status(200).json({ message: 'Recipe deleted successfully' });

  } catch (err) {
    await conn.rollback(); // Rollback the transaction in case of error
    console.error('Error deleting recipe:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    conn.release(); // Always release the connection back to the pool
  }
});
