// Ausgelesenen Artikel
let Artikel;
// Pfad zum Bilderverzeichnis
let Pfad = '../src/PNG/';

// Funktion zum Anzeigen eines JSON-Eintrags in einer Tabelle
function displayJsonEntryAsTable(entry) {
  let tableElement = document.getElementById('jsonTable');

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
    keyCell.style.fontWeight = 'bold';
    keyCell.style.width = '150px';
  }
}

// Füge einen Event Listener zum Suchen-Button hinzu
document
  .getElementById('searchButtonRFID')
  .addEventListener('click', function () {
    // Hole den eingegebenen RFID_TAG
    let rfidInput = document.getElementById('rfidInput').value;

    // Lade das JSON-Objekt von der externen Datei
    fetch('Logistikdatenbank_Artikel.json')
      .then((response) => response.json())
      .then((data) => {
        // Suche nach dem Eintrag mit dem entsprechenden RFID_TAG
        Artikel = data.find((entry) => entry.RFID_TAG == rfidInput);

        if (Artikel) {
          // Rufe die Funktion auf, um den gefundenen Eintrag als Tabelle anzuzeigen
          displayJsonEntryAsTable(Artikel);
          displayImageAsTable(Artikel);
          console.log(Artikel);
        } else {
          console.log(
            'Eintrag mit RFID_TAG ' + rfidInput + ' wurde nicht gefunden.'
          );
        }
      })
      .catch((error) =>
        console.error('Fehler beim Laden der JSON-Datei:', error)
      );
  });

// Füge einen Event Listener zum Suchen-Button hinzu
document
  .getElementById('searchButtonID')
  .addEventListener('click', function () {
    // Hole den eingegebenen RFID_TAG
    let idInput = document.getElementById('idInput').value;

    // Lade das JSON-Objekt von der externen Datei
    fetch('Logistikdatenbank_Artikel.json')
      .then((response) => response.json())
      .then((data) => {
        // Suche nach dem Eintrag mit dem entsprechenden RFID_TAG
        Artikel = data.find((entry) => entry.ID == idInput);

        if (Artikel) {
          // Rufe die Funktion auf, um den gefundenen Eintrag als Tabelle anzuzeigen
          displayJsonEntryAsTable(Artikel);
          displayImageAsTable(Artikel);
        } else {
          console.log(
            'Eintrag mit RFID_TAG ' + idInput + ' wurde nicht gefunden.'
          );
        }
      })
      .catch((error) =>
        console.error('Fehler beim Laden der JSON-Datei:', error)
      );
  });

// Füge einen Event Listener zum Gewichts-Button hinzu
document
  .getElementById('entryButtonWeight')
  .addEventListener('click', function () {
    // Hole den eingegebenen RFID_TAG
    let gewicht = document.getElementById('weightInput').value;

    // Schreibt das neue Gewicht in den Artikel
    Artikel.Anzahl_Artikel =
      (gewicht - Artikel.Gewicht_Behälter) / Artikel.Gewicht_Artikel;

    if (Artikel) {
      // Rufe die Funktion auf, um den gefundenen Eintrag als Tabelle anzuzeigen
      displayJsonEntryAsTable(Artikel);
      displayImageAsTable(Artikel);
    } else {
      console.log('Eintrag mit RFID_TAG ' + gewicht + ' wurde nicht gefunden.');
    }
  });

// Funktion zum Anzeigen eines JSON-Eintrags in einer Tabelle
function displayImageAsTable(entry) {
  let bildElement = document.getElementById('jsonBild');

  // Lösche vorhandene Bilder in der Tabelle
  while (bildElement.firstChild) {
    bildElement.removeChild(bildElement.firstChild);
  }

  var bildArtikel = createImage(Pfad + Artikel.Foto_ID, 'Foto Artikel');
  var bildZeichnung = createImage(
    Pfad + Artikel.Zeichnung_ID,
    'Konstruktionszeichnung'
  );

  bildElement.append(bildArtikel);
  bildElement.append(bildZeichnung);
}

// Funktion zum Erstellen eines Bild-Elements
function createImage(src, alt) {
  var img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.width = 365; // Breite des Bildes
  //img.height = 200; // Höhe des Bildes
  return img;
}
