import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/Welcome.css';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log('Login with email', email, password);
    
    e.preventDefault();
    try {
      // await signIn(auth, email, password);
      if (password === 'test') {
        console.log('Login successful');
        navigate('/recipes');
      }
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="logo">
          RECIPE RESERVE
        </h1>
        <p className="tagline">
          A place for storing your favorite recipes and weekly meal planning
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </label>

          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </label>

          {/* <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div> */}

          <button type="submit" className="sign-in-btn">Sign in</button>
        </form>

          {/* <button type="button" className="google-signin-btn">
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" />
            Sign in with Google
          </button> */}
      </div>
    </div>
  );
}

