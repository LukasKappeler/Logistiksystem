// Importe
// ----------------------------------------------------
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';

// ----------------------------------------------------
// Server
// ----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname + '/static')));
app.use(express.json());

app.listen(3000, () => {
    console.log("App lauscht auf Port 3000");
});

// ----------------------------------------------------------------
// MongoDB
// ----------------------------------------------------------------

// MongoDB-Verbindungsinformationen
const url = 'mongodb+srv://wlwProjekt:E-_xiV$9QCUnadP@inventar1.dmggykc.mongodb.net/InventarListe_v1'; // Verbindungsserver
const databaseName = 'InventarListe_v1';    // Datenbankname
const collectionName = 'Liste1';            // Sammlungsname Artikel
const collectionNameImages = 'images';      // Sammlungsname Bilder
const savePath = 'src/static/PNG/';         // Speicherort Bilder

// MONGO-01 Erstellen eines MongoClient mit einem MongoClientOptions-Objekt, um die Stable-API-Version festzulegen
// --------------------------------------------------------
const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        useUnifiedTopology: true,
    }
});

// MONGO-02 Connect to MongoDB
// --------------------------------------------------------
async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        await client.db("admin").command({ ping: 1 });
        console.log("Ping an Ihre Bereitstellung gesendet. Sie haben erfolgreich eine Verbindung zu MongoDB hergestellt!");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

// MONGO-03 Funktion zum Schließen der MongoDB-Verbindung
// --------------------------------------------------------
async function closeMongoConnection() {
    try {
        await client.close();
        console.log('Connection to MongoDB closed');
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error; // Wir werfen den Fehler, damit er im aufrufenden Code behandelt werden kann
    }
}

// MONGO-04 Am Ende des Programms (beim Herunterfahren des Servers) die Verbindung schließen
// --------------------------------------------------------
process.on('SIGINT', async () => {
    console.log('Caught interrupt signal');
    await closeMongoConnection();
    server.close(() => {
        console.log('Express server closed');
        process.exit();
    });
});

// SAVE-4 Daten in die MongoDB einfügen oder aktualisieren
// --------------------------------------------------------
async function insertOrUpdateData(client, data) {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Überprüfen, ob ein Eintrag mit dem angegebenen RFID_TAG vorhanden ist
    const existingEntry = await collection.findOne({ ID: data.ID });

    if (existingEntry) {
        // Eintrag aktualisieren, wenn vorhanden
        data.Datum_Geändert = new Date().toLocaleString(); // Aktuelles Datum und Uhrzeit aktualisieren
        const result = await collection.updateOne({ ID: data.ID }, { $set: data });
        console.log(`Eintrag aktualisiert für ID: ${data.ID}`);
    } else {
        // Eintrag einfügen, wenn nicht vorhanden
        const result = await collection.insertOne(data);
        console.log(`Neuer Eintrag erstellt für RFID_TAG: ${data.ID}`);
    }
}

// ID-4. Daten aus der MongoDB abrufen Suchen mit ID
// --------------------------------------------------------
async function fetchDataFromDatabaseID(client, key, value) {
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

// PIX-01 Download Images from MongoDB
// --------------------------------------------------------
async function downloadImage(documentNameToDownload, savePath) {
    const database = client.db(databaseName);
    const collection = database.collection(collectionNameImages);
    try {

        const letzterPunktIndex = documentNameToDownload.lastIndexOf(".");

        // Überprüfe, ob ein Punkt gefunden wurde und er nicht am Anfang oder Ende des Strings liegt
        if (letzterPunktIndex !== -1 && letzterPunktIndex !== 0 && letzterPunktIndex !== documentNameToDownload.length - 1) {
            // Extrahiere den Teil des Strings vor dem letzten Punkt
            documentNameToDownload = documentNameToDownload.slice(0, letzterPunktIndex);
        }

        // Find the document by its name
        const document = await collection.findOne({ image_name: documentNameToDownload });

        if (document) {
            // Get the image data from the document

            const imageData = Buffer.from(document.image_data.buffer); // Convert Binary to Buffer

            // Save the image data to a file with the image_name as the filename
            const savePathWithFilename = savePath + document.image_name + '.png';
            const fs = await import('fs/promises');
            // Stelle sicher, dass das Verzeichnis existiert
            await fs.mkdir(savePath, { recursive: true });
            await fs.writeFile(savePathWithFilename, imageData);

            console.log(`Image downloaded to ${savePathWithFilename}`);
        } else {
            console.log(`Document with name ${documentNameToDownload} not found.`);
        }
    } catch (error) {
        console.error('Error downloading image:', error);
    }
}

//----------------------------------------------------------
// Schnittstele Server <-> Client
//----------------------------------------------------------

// ID-2 Request von Client Suchen in Datenbank mit ID / RFID
// --------------------------------------------------------
app.get('/id/:key/:id', async (req, res) => {
    try {
        // Hier könntest du Daten aus einer Datenbank oder anderer Quelle abrufen
        const id = parseInt(req.params.id, 10);
        const key = req.params.key;

        // Daten aus der Datenbank abrufen
        await connectToMongo(); // Warten, bis die Verbindung hergestellt ist
        const data = await fetchDataFromDatabaseID(client, key, id);
        //await downloadImage(documentNameToDownload, savePath);
        await downloadImage(data.Foto_ID, savePath);
        await downloadImage(data.Zeichnung_ID, savePath);

        delete data._id;
        // Daten an den Client senden
        res.json(data);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten mit ID:', error);
        // Fehler an den Client senden
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// SAVE-2 Speichern des Artikels in der Datenbank
// --------------------------------------------------------
app.post('/save', async (req, res) => {
    try {
        // Hier könntest du Daten aus einer Datenbank oder anderer Quelle abrufen
        const artikel = req.body;

        console.log("Empfangen von Artikel:");
        console.log(artikel);

        // Daten aus der Datenbank abrufen
        await connectToMongo(); // Warten, bis die Verbindung hergestellt ist
        await insertOrUpdateData(client, artikel);

        // Daten an den Client senden
        res.json("OK");
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten mit ID:', error);
        // Fehler an den Client senden
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});