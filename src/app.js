import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import path from 'path'; // Add this line

const app = express();

app.use(express.static(path.join(__dirname + '/static')));

app.listen(3000, () => {
    console.log("App listener on port 3000");
});




/*
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Definiere das Verzeichnis für statische Dateien
const staticPath = dirname(fileURLToPath(import.meta.url));

// Benutzerdefinierte Middleware, um den Dateinamen zu ändern
app.use((req, res, next) => {
  const fileName = 'terminal.html';

  // Setze den Dateinamen manuell für jede Anfrage
  req.url = `/${fileName}`;

  next();
});

// Verwende das statische Verzeichnis
app.use(express.static(staticPath));

// Starte den Server
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});
*/





/* Original 

import express from 'express';

const app = express();
const port = 3000;


// Globale Variable, um Befehle im Speicher zu halten
const commands = [
  {
    name: 'ls',
    desc: 'lists files'
  },
  {
    name: 'pwd',
    desc: 'prints working directory'
  }
  // Fügen Sie hier weitere Befehle hinzu, falls erforderlich
];

app.get('/', (req, res) => {
  res.send('hello');
});

// Neuer GET-Endpoint für Befehle
app.get('/api/commands', (req, res) => {
  res.json(commands);
});

// Neuer POST-Endpoint für das Hinzufügen von Befehlen
app.post('/api/add-command', (req, res) => {
  const newCommand = req.body;

  // Überprüfen, ob der neue Befehl die erwartete Struktur hat
  if (!newCommand || !newCommand.name || !newCommand.desc) {
    return res
      .status(400)
      .json({ status: 'error', message: 'Invalid command format' });
  }

  // Befehl dem Array hinzufügen
  commands.push(newCommand);

  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Linux Commands available on ${port}`);
});
*/