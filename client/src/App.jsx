import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import FullRecipe from './pages/FullRecipe';
import RecipesList from './pages/RecipesList';
import Welcome from './pages/Welcome';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <nav>
        <Link to="/recipes">Recipes</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/recipes" element={<RecipesList />} />
        <Route path="/recipes/:id" element={<FullRecipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
