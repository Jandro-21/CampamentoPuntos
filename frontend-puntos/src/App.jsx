import React, { useState, useEffect } from 'react';
import './App.css';

// Recuerda cambiar esto por la URL de tu backend en Cloudflare cuando despliegues
const API_URL = 'https://campamentopuntos.alejandrodurillo.workers.dev/api'; 

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [monitor, setMonitor] = useState(localStorage.getItem('monitor'));
  const [teams, setTeams] = useState([]);
  const [logs, setLogs] = useState([]);
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  // Función combinada para obtener equipos y logs de golpe
  const fetchData = async () => {
    try {
      const [teamsRes, logsRes] = await Promise.all([
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/logs`)
      ]);
      
      if (teamsRes.ok) setTeams(await teamsRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
    } catch (error) {
      console.error("Error obteniendo datos:", error);
    }
  };

  // Efecto del Polling: Sincroniza los datos cada 3 segundos si hay sesión iniciada
  useEffect(() => {
    if (token) {
      fetchData(); // Carga inicial
      const interval = setInterval(() => {
        fetchData(); // Recarga en segundo plano
      }, 3000);
      
      // Limpieza del intervalo al desmontar o cerrar sesión
      return () => clearInterval(interval); 
    }
  }, [token]);

  // Efecto para gestionar el modo oscuro en el DOM
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('monitor', data.monitor);
        setToken(data.token);
        setMonitor(data.monitor);
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error conectando con el servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('monitor');
    setToken(null);
    setMonitor(null);
  };

  const createTeam = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: formData.get('name'), color: formData.get('color') })
    });
    fetchData();
    e.target.reset();
  };

  const updatePoints = async (id, action) => {
    await fetch(`${API_URL}/points`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action, monitor }) // Enviamos quién hace la acción
    });
    fetchData(); // Actualizamos inmediatamente para feedback instantáneo
  };

  if (!token) {
    return (
      <main className={`login-container ${darkMode ? 'dark-mode' : ''}`}>
        <form onSubmit={handleLogin} className="card-form glass-effect">
          <h2>Acceso Monitores</h2>
          <input type="text" placeholder="Usuario (ej. monitor1)" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="primary-btn">Entrar</button>
        </form>
      </main>
    );
  }

const deleteTeam = async (id) => {
    // Doble validación y confirmación
    if (monitor !== 'alejandro') return; 
    
    if (window.confirm("¿Seguro que quieres eliminar este equipo y todo su historial? Esta acción no se puede deshacer.")) {
      await fetch(`${API_URL}/teams/${id}?monitor=${monitor}`, {
        method: 'DELETE',
      });
      fetchData(); // Recarga la vista al instante
    }
  };

  return (
    <main className={`dashboard ${darkMode ? 'dark-mode' : ''}`}>
      <header className="glass-effect">
        <div>
          <h1>Gestión de Puntos</h1>
          <p className="monitor-badge">Monitor activo: <strong>{monitor}</strong></p>
        </div>
        <div className="header-controls">
          <label className="theme-toggle">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
            Oscuro
          </label>
          <button onClick={handleLogout} className="secondary-btn">Salir</button>
        </div>
      </header>
      
      <section className="form-section">
        <h3>Nuevo Equipo</h3>
        <form onSubmit={createTeam} className="card-form glass-effect">
          <input type="text" name="name" placeholder="Nombre del equipo..." required />
          <select name="color">
            <option value="Azul">Azul</option>
            <option value="Rojo">Rojo</option>
            <option value="Amarillo">Amarillo</option>
            <option value="Verde">Verde</option>
          </select>
          <button type="submit" className="primary-btn">Crear Equipo</button>
        </form>
      </section>

      <section className="teams-grid">
        {teams.map(team => (
          <article key={team.id} className={`team-card glass-effect border-${team.color.toLowerCase()}`}>
            
            {/* Botón de borrado condicional (solo para alejandro) */}
            {monitor === 'alejandro' && (
              <button onClick={() => deleteTeam(team.id)} className="btn-delete" title="Borrar equipo">
                🗑️
              </button>
            )}

            <h3>{team.name}</h3>
            <span className="points-display">{team.points} pts</span>
            <div className="point-controls">
              <button onClick={() => updatePoints(team.id, 'sub')} className="btn-icon">-</button>
              <button onClick={() => updatePoints(team.id, 'add')} className="btn-icon">+</button>
            </div>
          </article>
        ))}
      </section>

      <section className="logs-section glass-effect">
        <h3>Registro de Actividad</h3>
        <ul className="logs-list">
          {logs.map(log => (
            <li key={log.id} className="log-item">
              <strong>{log.monitor}</strong> hizo <strong>{log.action}</strong> puntos a <span className={`text-${log.color.toLowerCase()}`}>{log.team_name}</span>
            </li>
          ))}
          {logs.length === 0 && <p className="no-logs">Aún no hay movimientos.</p>}
        </ul>
      </section>
    </main>
  );
}

export default App;