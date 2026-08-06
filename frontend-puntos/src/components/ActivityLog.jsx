import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.js';

function formatChange(cambio) {
  const value = cambio > 0 ? `+${cambio}` : `${cambio}`;
  return <strong className={cambio > 0 ? 'up' : 'down'}>{value}</strong>;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ActivityLog() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'historial'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <section className="activity">
      <h2>El Chivato</h2>
      {entries.length === 0 ? (
        <p className="hint">Todavía no hay actividad registrada.</p>
      ) : (
        <ul className="log">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span className="log-time">[{formatTime(entry.timestamp)}]</span>{' '}
              <span className="log-author">{entry.autor}</span> modificó al equipo{' '}
              <strong>{entry.equipo}</strong> ({formatChange(entry.cambio)})
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
