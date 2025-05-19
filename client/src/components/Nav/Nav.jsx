import React from 'react';
import { NavLink } from 'react-router-dom';
import './navBar.css'; // Optional: Add custom styles here

const Nav = () => {
  return (
    <nav className="navBar">
      <span className="logo">Recipe Reserve</span>
      <div className="links">
        <NavLink to="/recipes" className="link">
          Recipes
        </NavLink>
        <NavLink to="/recipe/add" className="link">
          Add Recipe
        </NavLink>
        <NavLink to="/logout" className="link">
          Log Out
        </NavLink>
      </div>
    </nav>
  );
};

export default Nav;
