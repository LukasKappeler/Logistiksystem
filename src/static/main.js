// Ausgelesenen Artikel
let Artikel;
// Pfad zum Bilderverzeichnis
let Pfad = "../PNG/";

// Funktion zum Anzeigen eines JSON-Eintrags in einer Tabelle
function displayJsonEntryAsTable(entry) {
    let tableElement = document.getElementById("jsonTable");

    // Lösche vorhandene Zeilen in der Tabelle
    while (tableElement.rows.length > 0) {
        tableElement.deleteRow(0);
    }

    // Erstelle eine Zeile für jeden Schlüssel-Wert-Eintrag
    for (let key in entry) {
        let row = tableElement.insertRow();

        // Erstelle Zellen für Schlüssel und Wert
        let keyCell = row.insertCell(0);
        let valueCell = row.insertCell(1);

        // Setze Schlüssel und Wert in die Zellen
        keyCell.textContent = key;
        valueCell.textContent = entry[key];
        // Macht den Text der 1. Zeile Bold
        keyCell.style.fontWeight = "bold";
        keyCell.style.width = "150px";
    }
}

// ID-1 Button Suchen mit RFID_TAG
// --------------------------------------------------------
document
    .getElementById("searchButtonRFID")
    .addEventListener("click", function () {
        // Hole den eingegebenen RFID_TAG
        let key = "RFID_TAG"
        let rfidInput = document.getElementById("rfidInput").value;

        // Fortschrittsbalken anzeigen
        showProgressBar();

        // Leere das Eingabefeld nach dem Auslesen
        document.getElementById("rfidInput").value = "";

        fetch(`http://localhost:3000/id/${key}/${rfidInput}`)
            .then(response => response.json())
            .then(data => {
                console.log('Daten vom Server mit RFID:', data);
                // Hier kannst du die erhaltenen Daten weiterverarbeiten
                Artikel = data;
                displayJsonEntryAsTable(Artikel);
                displayImageAsTable(Artikel);
   
            })
            .catch(error => console.error('Fehler beim Abrufen der Daten:', error))
            .finally(() => {
                // Fortschrittsbalken ausblenden unabhängig vom Erfolg oder Fehler
                hideProgressBar();
            });
    });

// ID-1 Button Suchen mit ID
// --------------------------------------------------------
document
    .getElementById("searchButtonID")
    .addEventListener("click", function () {
        // Hole den eingegebenen ID
        let key = "ID"
        let idInput = document.getElementById("idInput").value;

        // Fortschrittsbalken anzeigen
        showProgressBar();

        // Leere das Eingabefeld nach dem Auslesen
        document.getElementById("idInput").value = "";

        fetch(`http://localhost:3000/id/${key}/${idInput}`)
            .then(response => response.json())
            .then(data => {
                console.log('Daten vom Server mit ID:', data);
                // Hier kannst du die erhaltenen Daten weiterverarbeiten
                Artikel = data;
                displayJsonEntryAsTable(Artikel);
                displayImageAsTable(Artikel);
            })
            .catch(error => console.error('Fehler beim Abrufen der Daten:', error))
            .finally(() => {
                // Fortschrittsbalken ausblenden unabhängig vom Erfolg oder Fehler
                hideProgressBar();
            });
    });

// Füge einen Event Listener zum Gewichts-Button hinzu
document
    .getElementById("entryButtonWeight")
    .addEventListener("click", function () {
        // Hole den eingegebenen RFID_TAG
        let gewicht = document.getElementById("weightInput").value;

        // Leere das Eingabefeld nach dem Auslesen
        document.getElementById("weightInput").value = "";

        // Schreibt das neue Gewicht in den Artikel
        Artikel.Anzahl_Artikel =
            (gewicht - Artikel.Gewicht_Behälter) / Artikel.Gewicht_Artikel;

        if (Artikel) {
            // Rufe die Funktion auf, um den gefundenen Eintrag als Tabelle anzuzeigen
            displayJsonEntryAsTable(Artikel);
            displayImageAsTable(Artikel);
        } else {
            console.log("Eintrag mit RFID_TAG " + gewicht + " wurde nicht gefunden.");
        }
    });

// SAVE-1 Speichert den Eintrag in der Datenbank
//---------------------------------------------------------
document.getElementById("saveButtonID").addEventListener("click", function () {
    // Datum erstellen
    // Aktuelles Datum und Uhrzeit erhalten
    let dateTime = new Date();

    // Datum formatieren
    let tag = dateTime.getDate();
    let monat = dateTime.getMonth() + 1; // Monate beginnen bei 0, daher +1
    let jahr = dateTime.getFullYear();

    // Uhrzeit formatieren
    let stunde = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let sekunde = dateTime.getSeconds();

    // Führende Nullen hinzufügen, wenn nötig
    tag = tag < 10 ? "0" + tag : tag;
    monat = monat < 10 ? "0" + monat : monat;
    stunde = stunde < 10 ? "0" + stunde : stunde;
    minute = minute < 10 ? "0" + minute : minute;
    sekunde = sekunde < 10 ? "0" + sekunde : sekunde;

    // String erstellen
    let dateModified =
        tag +
        "." +
        monat +
        "." +
        jahr +
        " " +
        stunde +
        ":" +
        minute +
        ":" +
        sekunde;

    Artikel.Datum_Geändert = dateModified;

    if (Artikel) {
        // Rufe die Funktion auf, um den gefundenen Eintrag als Tabelle anzuzeigen
        displayJsonEntryAsTable(Artikel);
        displayImageAsTable(Artikel);

        //console.log("Gesendet Artikel vom Client");
        //console.log(Artikel);

        fetch('http://localhost:3000/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Artikel),
        })
            .then(() => hideProgressBar());

    } else {
        console.log("Fehler beim Speichern des Artikels");
    }
});


// PRO-01 Fortschrittsbalken ON/OFF
// --------------------------------------------------------
// Function to show the progress bar
function showProgressBar() {
    document.getElementById('progress-container').style.display = 'block';
}

// Function to hide the progress bar
function hideProgressBar() {
    document.getElementById('progress-container').style.display = 'none';
}


// Funktion zum Anzeigen des Bildes in der Tabelle
function displayImageAsTable(entry) {
    let bildElement = document.getElementById("jsonBild");

    // Lösche vorhandene Bilder in der Tabelle
    while (bildElement.firstChild) {
        bildElement.removeChild(bildElement.firstChild);
    }

    console.log(Pfad + Artikel.Foto_ID);

    var bildArtikel = createImage(Pfad + Artikel.Foto_ID, "Foto Artikel");
    var bildZeichnung = createImage(
        Pfad + Artikel.Zeichnung_ID,
        "Konstruktionszeichnung"
    );

    bildElement.append(bildArtikel);
    bildElement.append(bildZeichnung);
}

// Funktion zum Erstellen eines Bild-Elements
function createImage(src, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.width = 365; // Breite des Bildes
    //img.height = 200; // Höhe des Bildes
    return img;
}







