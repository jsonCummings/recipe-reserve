import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FullRecipe from './pages/FullRecipe';
import RecipesList from './pages/RecipesList';
import Welcome from './pages/Welcome';
import './App.css';
import AddRecipePage from './pages/AddRecipe';
import EditRecipePage from './pages/EditRecipe';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/recipes" element={<RecipesList />} />
        <Route path="/recipe/add" element={<AddRecipePage />} />
        <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
        <Route path="/recipes/:id" element={<FullRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
