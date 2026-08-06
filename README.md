# CampamentoPuntos 🏕️

Sistema de puntuación en tiempo real para el campamento de verano, pensado para ser usado por varios monitores a la vez. Hecho con **React + Vite + Firebase** (Authentication y Firestore), listo para desplegar en **Vercel**.

## Funcionalidades

- **Login** con correo y contraseña (Firebase Authentication). Sin sesión → pantalla de acceso; con sesión → Dashboard.
- **Gestión de equipos y miembros** en tiempo real (`onSnapshot`): crear equipos, añadir integrantes al vuelo con un input rápido.
- **Puntuaciones en tiempo real**: botones −1 / +1 / +5 por equipo.
- **"El Chivato"**: muro de actividad con los últimos 10 movimientos (hora, monitor, equipo y cantidad), alimentado por la colección Firestore `historial` con `serverTimestamp()`.
- **Permisos**: solo el monitor cuyo correo contenga `alejandro` puede **borrar equipos** y **borrar personas**. Para el resto los botones de borrado están ocultos.

## Estructura

```
frontend-puntos/
  index.html
  vite.config.js
  vercel.json
  .env.example
  src/
    main.jsx
    App.jsx
    firebase.js
    index.css
    components/
      Login.jsx
      Dashboard.jsx
      TeamCard.jsx
      ActivityLog.jsx
firestore.rules
```

## Cómo arrancar

1. **Crea el proyecto en Firebase** (firebase.google.com):
   - Activa **Authentication → Sign-in method → Email/Password**.
   - Crea los usuarios monitores (añade al menos `alejandro@campamento.com`).
   - Crea **Firestore Database** en modo producción o prueba.
   - Añade una app web para obtener la configuración del SDK.

2. **Configura las variables de entorno**:

   ```bash
   cd frontend-puntos
   cp .env.example .env
   ```

   Rellena `.env` con los datos de tu app de Firebase.

3. **Publica las reglas de Firestore** (seguridad básica: solo autenticados):

   ```bash
   firebase deploy --only firestore:rules
   ```

4. **Instala y ejecuta**:

   ```bash
   npm install
   npm run dev
   ```

## Despliegue en Vercel

```bash
cd frontend-puntos
npm run build
npx vercel
```

O conéctalo directamente desde GitHub. Configura las mismas variables `VITE_FIREBASE_*` en **Settings → Environment Variables** de Vercel.

> **Importante**: el borrado de equipos/personas se oculta en la UI según el correo, pero la seguridad real se aplica mejor con reglas de Firestore y `securityRules` adicionales si quieres bloquear el borrado a nivel de servidor.

## Modelo de datos

- `equipos/{id}` → `{ nombre: string, puntos: number, miembros: string[] }`
- `historial/{id}` → `{ equipo: string, autor: string, cambio: number, timestamp: serverTimestamp }`
