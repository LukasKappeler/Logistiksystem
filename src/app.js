import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

import { MongoClient, ServerApiVersion } from 'mongodb';
//const { MongoClient } = require('mongodb');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname + '/static')));

app.listen(3000, () => {
    console.log("App listener on port 3000");
});



// Mongo DB
// ----------------------------------------------------------------

// MongoDB-Verbindungsinformationen
const uri = 'mongodb+srv://wlwProjekt:E-_xiV$9QCUnadP@inventar1.dmggykc.mongodb.net/InventarListe_v1'; // Verbindungsserver
const databaseName = 'InventarListe_v1'; // Datenbankname
const collectionName = 'Liste1'; // Sammlungsname

// Beispielaufruf mit den aktualisierten Daten
const newData = {
    "ID": 10001005,
    "RFID_TAG": 1,
    "Datum_Erstellt": "11.11.2000 11:28",
    "Datum_Geändert": "11.09.2023 11:28",
    "Lager_Ort": "Balsthal",
    "Lager_Platz": "Schrank 03",
    "Lager_Position": "A05",
    "Lager_Behälter": "AUER",
    "Gewicht_Behälter": 83,
    "Gewicht_Artikel": 10,
    "Anzahl_Artikel": 129,
    "Foto_ID": "Schraube.jpg",
    "Zeichnung_ID": "Schraube.png",
    "Artikel_Kategorie": "Schraube",
    "Artikel_Name": "Zylinderschraube mit Innensechskant",
    "Print_Name": "M3x20"
  };


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

// Eintrag aktualisieren oder neu Einfügen
// ---------------------------------------
async function runWriteData(newData) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Daten in die MongoDB aktualisieren oder einfügen.
        await insertOrUpdateData(client, newData);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}


// Eintrag aus MongoDB auslesen
// ---------------------------------------
async function runReadData(rfidValue) {
    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        // Daten aus der MongoDB abrufen und auf der Konsole ausgeben
        await fetchDataFromDatabase(client,rfidValue);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

runWriteData(newData).catch(console.dir);
//runReadData(12345678).catch(console.dir);

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


// Daten aus der MongoDB abrufen und auf der Konsole ausgeben
async function fetchDataFromDatabase(client,value) {
    const database = client.db(databaseName);
    const collection = database.collection(collectionName);

    // Hier wird nach einem Eintrag mit RFID_KEY = 1 gesucht
    const query = { RFID_TAG: value };

    // Daten abrufen
    const result = await collection.findOne(query);

    // Daten auf der Konsole ausgeben
    console.log('Gefundener Eintrag:');
    console.log(result);
}


