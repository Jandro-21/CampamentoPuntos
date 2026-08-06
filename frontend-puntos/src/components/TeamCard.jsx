import { useState } from 'react';
import {
  updateDoc,
  doc,
  deleteDoc,
  addDoc,
  collection,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase.js';

export default function TeamCard({ team, user, isAdmin }) {
  const [newMember, setNewMember] = useState('');
  const [busy, setBusy] = useState(false);

  async function changePoints(delta) {
    setBusy(true);
    try {
      const batch = writeBatch(db);
      const teamRef = doc(db, 'equipos', team.id);
      batch.update(teamRef, { puntos: team.puntos + delta });
      batch.set(doc(collection(db, 'historial')), {
        equipo: team.nombre,
        autor: user.email,
        cambio: delta,
        timestamp: serverTimestamp(),
      });
      await batch.commit();
    } finally {
      setBusy(false);
    }
  }

  async function addMember(e) {
    e.preventDefault();
    const nombre = newMember.trim();
    if (!nombre) return;
    setBusy(true);
    try {
      await updateDoc(doc(db, 'equipos', team.id), {
        miembros: [...(team.miembros ?? []), nombre],
      });
      setNewMember('');
    } finally {
      setBusy(false);
    }
  }

  async function removeMember(nombre) {
    setBusy(true);
    try {
      await updateDoc(doc(db, 'equipos', team.id), {
        miembros: (team.miembros ?? []).filter((m) => m !== nombre),
      });
    } finally {
      setBusy(false);
    }
  }

  async function removeTeam() {
    if (!window.confirm(`¿Eliminar el equipo "${team.nombre}" y todos sus puntos?`)) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, 'equipos', team.id));
    } finally {
      setBusy(false);
    }
  }

  const members = team.miembros ?? [];

  return (
    <article className="team-card">
      <div className="team-head">
        <h2>{team.nombre}</h2>
        {isAdmin && (
          <button
            className="danger small"
            onClick={removeTeam}
            disabled={busy}
            title="Eliminar equipo"
          >
            ✕
          </button>
        )}
      </div>

      <div className="score">
        <span className="score-value">{team.puntos ?? 0}</span>
        <span className="score-label">puntos</span>
      </div>

      <div className="score-buttons">
        <button onClick={() => changePoints(-1)} disabled={busy}>
          −1
        </button>
        <button onClick={() => changePoints(1)} disabled={busy}>
          +1
        </button>
        <button onClick={() => changePoints(5)} disabled={busy}>
          +5
        </button>
      </div>

      <div className="members">
        <h3>Integrantes</h3>
        {members.length === 0 ? (
          <p className="hint">Sin integrantes todavía.</p>
        ) : (
          <ul>
            {members.map((m) => (
              <li key={m}>
                <span>{m}</span>
                {isAdmin && (
                  <button
                    className="danger small"
                    onClick={() => removeMember(m)}
                    disabled={busy}
                    title="Eliminar persona"
                  >
                    ✕
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}

        <form className="member-form" onSubmit={addMember}>
          <input
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            placeholder="Añadir persona…"
          />
          <button type="submit" disabled={busy}>
            Añadir
          </button>
        </form>
      </div>
    </article>
  );
}
