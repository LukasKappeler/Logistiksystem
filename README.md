# Logistikterminal

## Projektbeschrieb

Mit dem Logistikterminal wird ein weiterer kleiner Teil eines grossen Logistikverwaltungsprojekts  erstellt. Es dient dazu, die Anzahl der einzulagernden Komponenten zu erfassen, inklusive Foto, und direkt in die Datenbank zu speichern. Im Rahmen des WLW-Projekts wurde bisher nur der Teil mit dem Lesen und Schreiben der Daten in die Datenbank realisiert.

<img src="Images/client01.png" alt="Projektübersicht WLW" style="max-width:60%;">

### Allgemeine Funktionsweise der Applikation

<img src="Images/Projekt_Uebersicht_wlw.png" alt="Projektübersicht WLW" style="max-width:60%;">

Das gesamte Logistiksystemprojekt besteht aus drei wesentlichen Bestandteilen:

1. **MongoDB-Datenbank**: Auf unserer MongoDB werden die Artikel als JSON-Objekte gespeichert. Ebenso werden die Bilder, die vom Logistikterminal erstellt werden, in diese Datenbank hochgeladen. Momentan läuft die MongoDB noch auf der MongoDB.com-Platform. Zu einem späteren Zeitpunkt wird die Datenbank auf einen Raspberry Pi übertragen.

2. **Artikelverwaltung**: Für die Anzeige neuer Artikel dient eine C++-Applikation. Mit dieser können Artikel erfasst, gelöscht und manipuliert werden. Diese Anwendung befindet sich auf dem Werkstattrechner und in meinem Büro.

3. **Das Logistikterminal**: Das Logistikterminal ist im Lager platziert. Die Aufgabe des Logistikterminals besteht darin, die Artikel vor dem Einlagern zu wiegen, zu fotografieren, die aktuelle Stückzahl zu berechnen und in die Datenbank zu aktualisieren. Jeder Lagerbehälter hat einen RFID-Tag, der vom Terminal erfasst wird. Anschliessend werden die Artikelinformationen und Artikelbilder von der Datenbank heruntergeladen und angezeigt. Nun kann der Artikel aktualisiert werden.

Im Fach WLW haben wir nur den gelb markierten Teil im Übersichtsdiagramm umgesetzt, die MongoDB-Datenbank für die Artikel erstellt und den Server mit einem statischen Client für das Logistikterminal umgesetzt.

### Serverseitigen API Endpoints

Wir haben momentan nur zwei serverseitigen API Endpoints.

1. **ID-2 Request von Client Suchen in Datenbank mit ID / RFID:**<br>
An einem get-request wird der Json-Key und Value des Artikels übergeben. Anhand der ID oder dem RFID-Tag des Artikels wird dieser von der MongoDB geholt. Im Artikel sind nun die Namen der benötigten Bilder. Somit werden diese anschliessend ebenfalls von der Datenbank heruntergeladen. Die Bilder werden einfach in einen Ordner gespeichert. Falls diese bereits vorhanden sind werden diese überschrieben. Das Json-Objekt des Artikels werden anschliessend dem client übergeben, der diese dann auf dem Panel anzeigt.

2. **SAVE-2 Speichern des Artikels in der Datenbank:**<br>
Dieser Post-Request wird benötigt um den Artikel in die Datenbank zu speichern. Es wird das Json-Objekt vom Artikel übergeben und anschliessend in der MongoDB gespeichert.

### Beschreibung des Source Codes und Funktionsweise des Clients

Da unser Client fix auf das Logistikterminal angepasst ist verwenden wir einen statischen Client. Dieser wird auf einem Raspberry Pi 7" Touch-Display mit 800x480pixel angezeigt und ist auf diese Auflösung optimiert. Er besteht nur aus einer Seite.

1. **ID-1 Button Suchen mit RFID_TAG oder ID:**<br>
Es gibt zwei Funktionen die für die Eingabe der ID oder RFID-Tag zuständig sind. Der RFID-Tag kann direkt mit dem RFID-Leser eingelesen werden. Durch betätigen des Suchbuttons wird ein Fetch-Request zum Server gesendet der dann das Json-Objekt und die Bilder von der Datenbank holt.

2. **GE-01 Button Eingabe des Gewichtes:**<br>
Verarbeitet das eingegebene Gewicht und Schreibt es in das Json-Objekt des Artikels. Mit der Gewichtsangabe wird der aktuelle Bestand vom Artikel berechnet. Dabei wird natürlich das Gewicht des Behälters und das Gewicht des Artikels benötigt das sich bereits im Json-Objekt befindet.

3. **SAVE-1 Speichert den Eintrag in der Datenbank**<br>
Aktualisiert das Datum des Artikels und übergibt diesen mit einem Fetch-Request dem Server der diesen anschliessend in die MongoDB speichert.

4. **Funktionen:**<br>

- displayJsonEntryAsTable: Zeigt der Artikel als Tabelle an.
- showProgressBar und hideProgressBar: Wenn der Artikel von der Datenbank geholt , wird ein Fortschrittsbalken eingeblendet.
- displayImageAsTable und createImage: Holt das Bild aus dem Ordner wo es zuvor heruntergeladen wurde und zeigt die zwei Bilder auf der linken Seite an.

### Hardwareanbindung

Aktuell ist noch keine spezielle Hardware integriert. Lediglich das 7-Zoll-LCD-Display, das direkt mit dem Raspberry Pi verbunden ist, sowie der RFID-Leser, der direkt über USB auf den stdio schreibt und wie eine Tastatur agiert. Zu einem späteren Zeitpunkt wird der Server des Logistikterminals zusätzliche Aufgaben übernehmen:

- Steuerung einer Waage über RS323.
- Verwendung einer Raspberry Pi Kamera, um Fotos von den Artikeln aufzunehmen.
- Ansteuerung der WS2812b LEDs, um das Licht so zu gestalten, dass die Fotos optimal beleuchtet sind.

## Installation und Inbetriebnahme

### Installation Raspberry Pi

- Verwende den Raspberry Pi Imager, um das neueste Raspbian mit Desktop auf die SD-Karte zu schreiben.
  Dabei ist zu beachten das unter Einstellungen im Imager bereits das Login, SSH, und WiFi voreingestellt wird. Dies ist zwar nicht zwingend aber erleichtert den Zugriff enorm.

<img src="Images/Imager_Edit.png" alt="Projektübersicht WLW" style="max-width:40%;">

#### Node.js und npm installieren

```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

#### Yarn installieren

```bash
sudo npm install -g yarn
```

#### Überprüfen Sie die Installation

```bash
yarn --version
```

#### Kopieren der Daten auf den Raspberry Pi

Mit FileZilla oder über das Terminal mit clone müssen jetzt das Git-Projekt auf den Raspberry Pi kopiert werden. Kopieren sie die Daten unter:

```bash
/home/user/Logistiksystem
```

#### Skript ausführen um den Server und App zu Starten.

Im Ordner Skript hat es ein Bash-Skript "startServerAndOpen.sh".
Dieses startet den Server und öffnet den Web-Browser in Full-Screen mit dem Client.
