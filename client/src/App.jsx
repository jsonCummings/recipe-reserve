import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    fetch('/api/ping')
      .then(res => res.json())
      .then(data => setPing(data.message));
  }, []);

  return (
    <section>
      <h1>Recipe App</h1>
      <h3>Backend says: {ping}</h3>
    </section>
  );
}

export default App;
