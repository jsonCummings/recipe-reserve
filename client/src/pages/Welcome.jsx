import { useEffect, useState } from 'react';

export default function Welcome() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => res.json())
      .then((data) => setPing(data.message));
  }, []);

  return (
    <section>
      <h4>Recipe App</h4>
      <h5>Backend says: {ping}</h5>
    </section>
  );
}
