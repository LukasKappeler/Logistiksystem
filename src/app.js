// Importe
// ----------------------------------------------------
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname + '/static')));

app.listen(3000, () => {
    console.log("App lauscht auf Port 3000");
});


// MongoDB
// ----------------------------------------------------------------

// MongoDB-Verbindungsinformationen
const uri = 'mongodb+srv://wlwProjekt:E-_xiV$9QCUnadP@inventar1.dmggykc.mongodb.net/InventarListe_v1'; // Verbindungsserver
const databaseName = 'InventarListe_v1'; // Datenbankname
const collectionName = 'Liste1'; // Sammlungsname

// Beispielaufruf mit den aktualisierten Daten
const newData = {
    "ID": 10001005,
    "RFID_TAG": 6,
    "Datum_Erstellt": "01.11.2000 11:28",
    "Datum_Geaendert": "22.09.2023 11:28",
    "Lager_Ort": "Balsthal",
    "Lager_Platz": "Schrank 03",
    "Lager_Position": "A05",
    "Lager_Behälter": "AUER",
    "Gewicht_Behälter": 65,
    "Gewicht_Artikel": 10,
    "Anzahl_Artikel": 129,
    "Foto_ID": "Schraube.jpg",
    "Zeichnung_ID": "Schraube.png",
    "Artikel_Kategorie": "Schraube",
    "Artikel_Name": "Zylinderschraube mit Innensechskant",
    "Print_Name": "M3x20"
};


// Erstellen eines MongoClient mit einem MongoClientOptions-Objekt, um die Stable-API-Version festzulegen
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});




// Eintrag aktualisieren oder neu einfügen
// ---------------------------------------
async function runWriteData(newData) {
    try {
        // Client mit dem Server verbinden (optional ab v4.7)
        await client.connect();
        // Senden eines Pings zur Bestätigung einer erfolgreichen Verbindung
        await client.db("admin").command({ ping: 1 });
        console.log("Ping an Ihre Bereitstellung gesendet. Sie haben erfolgreich eine Verbindung zu MongoDB hergestellt!");
        // Daten in die MongoDB aktualisieren oder einfügen.
        await insertOrUpdateData(client, newData);
    } finally {
        // Stellt sicher, dass der Client geschlossen wird, wenn Sie fertig sind/fehlschlagen
        await client.close();
    }
}


// ID-3. Verbindung zu MongoDB herstellen - Suchen mit ID
// --------------------------------------------------------
async function runReadDataID(key,id) {
    try {
        // Client mit dem Server verbinden (optional ab v4.7)
        await client.connect();
        // Senden eines Pings zur Bestätigung einer erfolgreichen Verbindung
        await client.db("admin").command({ ping: 1 });
        console.log("Ping an MongoDB gesendet. Sie haben erfolgreich eine Verbindung zu MongoDB hergestellt!");
        
        // Daten aus der MongoDB abrufen und auf der Konsole ausgeben
        const result = await fetchDataFromDatabaseID(client, key , id);

        // Das Ergebnis zurückgeben
        return result;
    } finally {
        // Stellt sicher, dass der Client geschlossen wird, wenn Sie fertig sind/fehlschlagen
        await client.close();
    }
}


//runWriteData(newData).catch(console.dir);
//runReadDataID(10001005).catch(console.dir);



// Daten in die MongoDB einfügen oder aktualisieren
async function insertOrUpdateData(client, newData) {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Überprüfen, ob ein Eintrag mit dem angegebenen RFID_TAG vorhanden ist
    const existingEntry = await collection.findOne({ RFID_TAG: newData.RFID_TAG });

    if (existingEntry) {
        // Eintrag aktualisieren, wenn vorhanden
        newData.Datum_Geändert = new Date().toLocaleString(); // Aktuelles Datum und Uhrzeit aktualisieren
        const result = await collection.updateOne({ RFID_TAG: newData.RFID_TAG }, { $set: newData });
        console.log(`Eintrag aktualisiert für RFID_TAG: ${newData.RFID_TAG}`);
    } else {
        // Eintrag einfügen, wenn nicht vorhanden
        const result = await collection.insertOne(newData);
        console.log(`Neuer Eintrag erstellt für RFID_TAG: ${newData.RFID_TAG}`);
    }
}

// ID-4. Daten aus der MongoDB abrufen Suchen mit ID
// --------------------------------------------------------
async function fetchDataFromDatabaseID(client,key, value) {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Hier wird nach einem Eintrag mit RFID_KEY = 1 gesucht
    const query = { [key]: value };

    // Daten abrufen
    const result = await collection.findOne(query);

    // Daten auf der Konsole ausgeben
    // console.log('Gefundener Eintrag:');
    // console.log(result);

    // Das Ergebnis zurückgeben
    return result;
}


// Schnittstele Server <-> Client
//----------------------------------------------------------


// ID-2 Request von Client Suchen in Datenbank mit ID
// --------------------------------------------------------
app.get('/id/:key/:id', async (req, res) => {
    try {
        // Hier könntest du Daten aus einer Datenbank oder anderer Quelle abrufen
        const id = parseInt(req.params.id, 10);
        const key = req.params.key;
  
        // Daten aus der Datenbank abrufen
        const daten = await runReadDataID(key,id);

        // Daten an den Client senden
        res.json(daten);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten mit ID:', error);
        // Fehler an den Client senden
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

