import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase.js';
import TeamCard from './TeamCard.jsx';
import ActivityLog from './ActivityLog.jsx';

export default function Dashboard({ user }) {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(true);
  const isAdmin = (user?.email ?? '').toLowerCase().includes('alejandro');

  useEffect(() => {
    const q = query(collection(db, 'equipos'), orderBy('nombre'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTeams(list);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function handleAddTeam(e) {
    e.preventDefault();
    const nombre = newTeamName.trim();
    if (!nombre) return;
    await addDoc(collection(db, 'equipos'), {
      nombre,
      puntos: 0,
      miembros: [],
    });
    setNewTeamName('');
  }

  return (
    <div className="dashboard">
      <header className="topbar">
        <h1>Campamento Puntos</h1>
        <div className="user-info">
          <span>
            {user.email} {isAdmin && <em className="admin-badge">admin</em>}
          </span>
          <button className="ghost" onClick={() => signOut(auth)}>
            Salir
          </button>
        </div>
      </header>

      <form className="add-team" onSubmit={handleAddTeam}>
        <input
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Nuevo equipo…"
        />
        <button type="submit">Añadir equipo</button>
      </form>

      {loading ? (
        <p className="hint">Cargando equipos…</p>
      ) : teams.length === 0 ? (
        <p className="hint">Todavía no hay equipos. ¡Crea el primero!</p>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} user={user} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      <ActivityLog />
    </div>
  );
}
