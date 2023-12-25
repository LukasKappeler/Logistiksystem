import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

  
// Mongo DB
const url = 'mongodb+srv://wlwProjekt:E-_xiV$9QCUnadP@inventar1.dmggykc.mongodb.net/';
const dbName = 'InventarListe_v1';

export async function connectAndFind(key, value) {
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Verbindung zur Datenbank hergestellt');

        const db = client.db(dbName);
        const collection = db.collection('DEINE_COLLECTION_NAME');

        // Suche nach dem gewünschten Schlüssel-Wert-Paar
        const query = { [key]: value };
        const result = await collection.findOne(query);

        if (result) {
            console.log('Gefundenes Objekt:', result);
            return result; // Gib das gefundene Objekt zurück
        } else {
            console.log('Objekt nicht gefunden');
            return null; // Gib null zurück, wenn das Objekt nicht gefunden wurde
        }
    } finally {
        await client.close();
        console.log('Verbindung geschlossen');
    }
}
  

  const app = express();

  app.use(express.static(path.join(__dirname + '/static')));
  
  app.listen(3000, () => {
      console.log("App listener on port 3000");
  });


