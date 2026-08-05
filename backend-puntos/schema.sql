CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
INSERT INTO users (username, password) VALUES ('alejandro', 'monitor0922');
INSERT INTO users (username, password) VALUES ('marta', 'monitor0922');
INSERT INTO users (username, password) VALUES ('dani', 'monitor41149');
INSERT INTO users (username, password) VALUES ('alba', 'monitor11221');

CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    monitor TEXT NOT NULL,
    team_id INTEGER NOT NULL,
    action TEXT NOT NULL, -- Guardaremos '+1' o '-1'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id)
);