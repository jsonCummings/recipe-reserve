import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    fetch('/api/ping')
      .then(res => res.json())
      .then(data => setPing(data.message));
  }, []);

  return <h1>Backend says: {ping}</h1>;
}

export default App;
