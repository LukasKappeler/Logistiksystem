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
