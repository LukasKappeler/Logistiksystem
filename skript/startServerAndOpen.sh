#!/bin/bash

# Pfad zum Logistiksystem-Verzeichnis
LOGISTIKSYSTEM_DIR="/home/lukas/Logistiksystem/Logistiksystem"

# Starte den Yarn-Server
cd "$LOGISTIKSYSTEM_DIR"
yarn start &

# Warte kurz, um sicherzustellen, dass der Server gestartet wurde (kann angepasst werden)
sleep 5

# Überprüfe, ob der Webbrowser installiert ist
if ! command -v chromium-browser &> /dev/null
then
    echo "Chromium-Browser ist nicht installiert. Bitte installiere ihn zuerst."
    exit
fi

# Starte den Webbrowser im Vollbildmodus und öffne die Webseite
chromium-browser --kiosk http://localhost:3000/