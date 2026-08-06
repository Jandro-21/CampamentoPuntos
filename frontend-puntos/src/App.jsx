import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase.js';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div className="loading">Cargando…</div>;
  }

  return user ? <Dashboard user={user} /> : <Login />;
}
